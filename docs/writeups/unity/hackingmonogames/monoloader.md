# Making our Mono Loader DLL
> This will go over making our Mono Loader DLL which will actually inject our C# Cheat into our Mono Unity Game!

## Step 1: Create our Visual Studio Project
1. Open Visual Studio Community 2022
2. Create a new project
3. Choose a C++ Dynamic-Link Library (DLL) as the template
4. Click Next
5. Name it MonoLoader
6. Change the location to wherever you want to store it
7. Make sure to check the box that says "Place solution and project in the same directory"
8. Click create

## Step 2: Preparing our Project
1. Hover over project in the top
2. Then click MonoLoader Properties
3. Then go to advanced
4. Change the character set to a multibyte character set
5. Click apply then click ok
6. Remove all the premade code inside of the dllmain.cpp

## Step 3: The Code
1. I will now send the code for the injector, type this code into your project or copy paste it.
``` cpp
// Including default headers
#include "pch.h"
#include <Windows.h>
#include <cstdio>
#include <iostream>
using namespace std;

// Mono defines to avoid needing to import Mono headers
// These typedefs create pointers for Mono types. This avoids including Mono's original headers.
// VOID is used instead of void to match Windows typedef style.
// Each Mono type is represented as a VOID pointer.
typedef VOID MonoDomain;
typedef VOID MonoAssembly;
typedef VOID MonoImage;
typedef VOID MonoClass;
typedef VOID MonoMethod;
typedef VOID MonoObject;
typedef VOID MonoImageOpenStatus;

// Defining function pointers for Mono functions
// These typedefs replicate function signatures from Mono headers but without importing them directly.
// This helps us dynamically load Mono functions using GetProcAddress.
// Here is the official def for thread attach within the mono jit.h header file
// MonoDomain* mono_jit_thread_attach (MonoDomain *domain);
// You can see all we are doing is recreating its signature (Matching its type parameters arguements etc)
// Note a key difference with thread attach specifically is we call it a void typedef. We do this as we do not need to do anything with the return value with the rest we do need the return value so we match the return value type
typedef void(__cdecl* t_mono_thread_attach)(MonoDomain*); // Function to attach the current thread to the Mono runtime.
t_mono_thread_attach fnThreadAttach; // Declare a variable to hold the function pointer.
typedef MonoDomain* (__cdecl* t_mono_get_root_domain)(void);
t_mono_get_root_domain fnGetRootDomain;
typedef const char* (__cdecl* t_mono_assembly_getrootdir)(void);
t_mono_assembly_getrootdir fnGetRootDir;
typedef MonoAssembly* (__cdecl* t_mono_assembly_open)(const char*, MonoImageOpenStatus*);
t_mono_assembly_open fnAssemblyOpen;
typedef MonoImage* (__cdecl* t_mono_assembly_get_image)(MonoAssembly*);
t_mono_assembly_get_image fnAssemblyGetImage;
typedef MonoClass* (__cdecl* t_mono_class_from_name)(MonoImage*, const char*, const char*);
t_mono_class_from_name fnClassFromName;
typedef MonoMethod* (__cdecl* t_mono_class_get_method_from_name)(MonoClass*, const char*, int);
t_mono_class_get_method_from_name fnMethodFromName;
typedef MonoObject* (__cdecl* t_mono_runtime_invoke)(MonoMethod*, void*, void**, MonoObject**);
t_mono_runtime_invoke fnRuntimeInvoke;

// Our main code
void Init() {
    // Allocate a console window for output and debugging
    AllocConsole();
    FILE* console;
    freopen_s(&console, "CONOUT$", "w", stdout); // Redirect stdout to the console
    freopen_s(&console, "CONIN$", "r", stdin);  // Redirect stdin to the console
    cout.clear();  // Clear any existing output buffer

    // Prompt the user for details about the DLL to inject
    string dllName;              // DLL file name (the cheat DLL)
    string payloadNamespace;     // Namespace of the cheat DLL
    string payloadClass;         // Class name in the cheat DLL
    string payloadMainFunction;  // Main function name to invoke in the cheat class

    cout << "Make sure the .dll you want to inject is inside of the game's Managed folder or this will not work!\n";
    cout << "Input the name of the .dll file you want to inject (Include the .dll extension in the name): \n";
    cin >> dllName;  // Get the DLL name from the user
    cout << "\nInput the name of the .dll's namespace: \n";
    cin >> payloadNamespace;  // Get the namespace of the cheat DLL
    cout << "\nInput the name of the .dll's loader class: \n";
    cin >> payloadClass;  // Get the class name from the user
    cout << "\nInput the name of the main function in the loader class: \n";
    cin >> payloadMainFunction;  // Get the main function name
    cout << "\n";

    // Load the Mono.dll module into memory so we can use its functions
    // Note: LoadLibraryW uses wide characters (hence the 'L' before the string)
    HMODULE monoModule = LoadLibraryW(L"mono.dll");
    // LoadLibraryW (Learn more here: https://learn.microsoft.com/en-us/windows/win32/api/libloaderapi/nf-libloaderapi-loadlibraryw) loads Mono.dll dynamically and returns a handle to the loaded module, enabling us to retrieve Mono functions via GetProcAddress (Learn more here: https://learn.microsoft.com/en-us/cpp/build/getprocaddress?view=msvc-170).

    // Initialize the Mono function pointers using GetProcAddress to get the address of the functions inside Mono.dll so we can call them
    // To find more information on mono functions see: https://www.mono-project.com/docs/advanced/embedding/ or dig through the Mono headers you get from download Mono at:  https://www.mono-project.com/download/stable/
    fnThreadAttach = (t_mono_thread_attach)GetProcAddress(monoModule, "mono_thread_attach"); // What this does is register a calling thread (the current dll in this case) within the Mono runtime allowing us to use the other mono functions
    fnGetRootDomain = (t_mono_get_root_domain)GetProcAddress(monoModule, "mono_get_root_domain"); // Returns the root domain of the Mono runtime in the game process.
    fnGetRootDir = (t_mono_assembly_getrootdir)GetProcAddress(monoModule, "mono_assembly_getrootdir"); // This function will return the root directory of the assembly, aka in our case the Managed folder where the games .dll files are stored which also contains our cheat .dll file
    fnAssemblyGetImage = (t_mono_assembly_get_image)GetProcAddress(monoModule, "mono_assembly_get_image"); // This gets an image (metadata) about the assembly we loaded. Allowing us to see data within the assembly like types methods fields classes etc
    fnAssemblyOpen = (t_mono_assembly_open)GetProcAddress(monoModule, "mono_assembly_open"); // Opens a Mono assembly (DLL file) from a specified path.
    fnClassFromName = (t_mono_class_from_name)GetProcAddress(monoModule, "mono_class_from_name"); // This simply gets the class from our assembly image
    fnMethodFromName = (t_mono_class_get_method_from_name)GetProcAddress(monoModule, "mono_class_get_method_from_name"); // this simply gets a method from our assembly image
    fnRuntimeInvoke = (t_mono_runtime_invoke)GetProcAddress(monoModule, "mono_runtime_invoke"); // This will invoke a method

    // Attach the current thread (this DLL) to the Mono runtime.
    MonoDomain* domain = fnGetRootDomain();  // Retrieve the root Mono domain
    fnThreadAttach(domain);  // Attach this DLL thread to the Mono runtime (We do this first to prevent issues when interacting with the rest of the mono functions)

    // Build the full path to the cheat DLL inside the game's Managed folder
    string assemblyDir;
    assemblyDir.append(fnGetRootDir());  // Get the root directory of the assemblies
    assemblyDir.append("/" + dllName);   // Append the cheat DLL's name to the directory path

    // Open the cheat DLL (assembly) and load it into the Mono runtime.
    MonoAssembly* cheatAssembly = fnAssemblyOpen(assemblyDir.c_str(), NULL);  // Open the cheat assembly

    // Get the class and method from the cheat assembly.
    MonoImage* cheatImage = fnAssemblyGetImage(cheatAssembly);  // Get the image (metadata) from the assembly
    MonoClass* cheatClass = fnClassFromName(cheatImage, payloadNamespace.c_str(), payloadClass.c_str());  // Get the cheat class
    MonoMethod* cheatMethod = fnMethodFromName(cheatClass, payloadMainFunction.c_str(), 0);  // Get the method in the cheat class

    // Invoke the method (main function) of the cheat class.
    fnRuntimeInvoke(cheatMethod, NULL, NULL, NULL);  // Execute the cheat method
}

// The DllMain function is the entry point of a DLL. It is called when the DLL is loaded or unloaded.
BOOL APIENTRY DllMain(HMODULE hModule, DWORD ul_reason_for_call, LPVOID lpReserved)
{
    switch (ul_reason_for_call) {
    case DLL_PROCESS_ATTACH:
        Init();  // Call Init() when the DLL is injected (attached to the process)
        break;
    case DLL_THREAD_ATTACH:
    case DLL_THREAD_DETACH:
    case DLL_PROCESS_DETACH:
        break;
    }
    return TRUE;  // Return TRUE to indicate successful loading of the DLL
}

```
### Explaining the code
> This will provide a brief run down of the steps the code is taking, and the reasons behind it. The code itself is commented heavily to explain what is happening at each step, but if you want a more indepth understanding you will have to do research yourself.

- Set Up Console for Debugging: Opens a console window for input and output to help the user specify the DLL, namespace, class, and function to inject.
- Load Mono Functions: Dynamically loads Mono's functions (mono.dll) using GetProcAddress. These functions are necessary to interact with the Mono runtime in the game.
- Attach Current Thread to Mono: The injector thread is registered with the Mono runtime so it can safely call Mono-related functions.
- Load Cheat DLL: The injector finds and loads the cheat DLL from the game's "Managed" folder.
- Retrieve Class and Method: It looks for a specific class and method in the cheat DLL, as specified by the user.
- Invoke Cheat Method: Finally, it executes the method (function) in the cheat DLL to run the cheat's logic inside the game.

## Step 4: Building the Project
1. Hover over build
2. Then choose build solution
3. Once completed it will provide you with a directory as to where it stored our program. Remember where this is as we will use it later.

## Conclusion
- This covers making our Mono Loader DLL that will load our cheat .dll into the Mono runtime for a Mono Unity game.
- While this does teach you exactly how to make a Mono Loader I highly reccommend you research and study Mono so you understand exactly what is going on here.