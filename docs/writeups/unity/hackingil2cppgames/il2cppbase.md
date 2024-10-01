# Making our IL2CPP Base DLL
> This will go over making our IL2CPP Base DLL (Where we make our cheats)

## Step 1: Create our Visual Studio Project
1. Open Visual Studio Community 2022
2. Create a new project
3. Choose a C++ Dynamic-Link Library (DLL) as the template
4. Click Next
5. Name it IL2CPPBase
6. Change the location to wherever you want to store it
7. Make sure to check the box that says "Place solution and project in the same directory"
8. Click create

## Step 2: Preparing our Project
1. Hover over project in the top
2. Then click IL2CPPBase Properties
3. Then go to advanced
4. Change the character set to a multibyte character set
5. Click apply
6. Go to C/C++ then go to Language
7. Change C++ Language Standard to C++ 17
8. Click apply
9. Go to General
10. Under the Additional Include Directories add C:\Program Files\Unity\Hub\Editor\2022.3.15f1\Editor\Data\il2cpp\libil2cpp  (Note this may change depending on where you install Untiy, and what versin you installed)
11. Click apply and ok
6. Remove all the premade code inside of the dllmain.cpp

## Step 4: The Code
1. I will now send the code for the cheat, type this code into your project or copy paste it.
``` cpp
// Default headers
#include "pch.h"
#include <memory>
#include <map>
#include <string>
#include <Windows.h>
#include <iostream>
using namespace std;

// Include in your project : C:\Program Files\Unity\Hub\Editor\2021.3.5f1\Editor\Data\il2cpp\libil2cpp
// make sure to use C++ 17 or higher

// Defining and setting our types for il2cpp
#define DO_API(r, n, p); // This is reuired for one of the included files
#ifndef IL2CPP_ILTYPES_H_
#define IL2CPP_ILTYPES_H_

// Include IL2CPP API types and functions
#include <il2cpp-api-types.h>
#include <il2cpp-api-functions.h> // File is a godsend and where we can find exact function signatures
#include <il2cpp-class-internals.h>
#include <il2cpp-object-internals.h>

// Typedefs for IL2CPP functions to be used later
// You can find the info for these inside of il2cpp-api-functions.h
// We are basically just recreating the function signatures
// DO_API(Il2CppDomain*, il2cpp_domain_get, ());
// DO_API(const Il2CppAssembly**, il2cpp_domain_get_assemblies, (const Il2CppDomain * domain, size_t * size));
// these are 2 examples from the file
typedef Il2CppDomain* (*domain_get_t)();
typedef const Il2CppAssembly** (*domain_get_assemblies_t)(const Il2CppDomain* domain, size_t* size);
typedef const Il2CppAssembly* (*domain_assembly_open_t)(Il2CppDomain* domain, const char* name);
typedef Il2CppClass* (*class_from_name_t)(const Il2CppImage* assembly, const char* name_space, const char* name);
typedef Il2CppClass* (*class_from_type_t)(const Il2CppType* type);
typedef MethodInfo* (*class_get_method_from_name_t)(Il2CppClass* klass, const char* name, int paramcount);
typedef const PropertyInfo* (*class_get_property_from_name_t)(Il2CppClass* klass, const char* name);
typedef Il2CppClass* (*class_from_il2cpp_type_t)(const Il2CppType* type);
typedef const MethodInfo* (*class_get_methods_t)(Il2CppClass* klass, void** iter);
typedef FieldInfo* (*class_get_field_from_name_t)(Il2CppClass* klass, const char* name);
typedef void (*field_get_value_t)(Il2CppObject* obj, FieldInfo* field, void* value);
typedef Il2CppObject* (*field_get_value_object_t)(FieldInfo* field, Il2CppObject* obj);
typedef Il2CppObject* (*type_get_object_t)(const Il2CppType* type);
typedef Il2CppObject* (*runtime_invoke_t)(const MethodInfo* method, void* obj, void** params, Il2CppException** exc);
typedef Il2CppObject* (*runtime_invoke_convert_args_t)(const MethodInfo* method, void* obj, Il2CppObject** params, int paramCount, Il2CppObject** exc);
typedef Il2CppString* (*string_new_t)(const char* str);
typedef Il2CppThread* (*thread_attach_t)(Il2CppDomain* domain);
typedef Il2CppObject* (*value_box_t)(Il2CppClass* klass, void* data);
typedef Il2CppObject* (*object_new_t)(Il2CppClass* klass);
typedef void* (*object_unbox_t)(Il2CppObject* obj);
typedef void (*runtime_object_init_t)(Il2CppObject* obj);
typedef FieldInfo* (*class_get_fields_t)(Il2CppClass* klass, void** iter);

// Inline declarations of the function pointers to avoid multiple definitions
inline domain_get_t domain_get;
inline domain_get_assemblies_t domain_get_assemblies;
inline domain_assembly_open_t domain_assembly_open;
inline class_from_name_t class_from_name;
inline class_from_type_t class_from_type;
inline class_get_method_from_name_t class_get_method_from_name;
inline class_get_property_from_name_t class_get_property_from_name;
inline class_from_il2cpp_type_t class_from_il2cpp_type;
inline class_get_methods_t class_get_methods;
inline class_get_field_from_name_t class_get_field_from_name;
inline field_get_value_t field_get_value;
inline field_get_value_object_t field_get_value_object;
inline type_get_object_t type_get_object;
inline runtime_invoke_t runtime_invoke;
inline runtime_invoke_convert_args_t runtime_invoke_convert_args;
inline string_new_t string_new;
inline thread_attach_t thread_attach;
inline value_box_t value_box;
inline object_new_t object_new;
inline object_unbox_t object_unbox;
inline runtime_object_init_t runtime_object_init;
inline class_get_fields_t class_get_fields;
#endif

HMODULE asmMod; // Handle for the assembly module
Il2CppDomain* domain; // IL2CPP domain pointer
size_t asmCount; // Count of assemblies in the domain
const Il2CppAssembly** asmList; // List of assemblies

Il2CppImage* GetImageByName(const char* targetName) {
    asmList = domain_get_assemblies(domain, &asmCount); // Get the list of assemblies in the domain
    for (size_t i = 0; i < asmCount; i++) {
        // Retrieve the Il2CppImage directly using the assembly name
        Il2CppImage* image = domain_assembly_open(domain, asmList[i]->aname.name)->image;

        // Check if the assembly name matches the target name
        if (strcmp(asmList[i]->aname.name, targetName) == 0) {
            return image; // Return the image if the name matches
        }
    }
    return nullptr; // Return nullptr if no image with the specified name is found
}

void Init() {
    asmMod = GetModuleHandleA("GameAssembly.dll"); // Get a handle to the GameAssembly module
    // Initialize IL2CPP function pointers
    // These are basically getting these functions from the GameAssembly.dll so we can call them
    domain_get = reinterpret_cast<domain_get_t>(GetProcAddress(asmMod, "il2cpp_domain_get"));
    domain_get_assemblies = reinterpret_cast<domain_get_assemblies_t>(GetProcAddress(asmMod, "il2cpp_domain_get_assemblies"));
    domain_assembly_open = reinterpret_cast<domain_assembly_open_t>(GetProcAddress(asmMod, "il2cpp_domain_assembly_open"));
    class_from_name = reinterpret_cast<class_from_name_t>(GetProcAddress(asmMod, "il2cpp_class_from_name"));
    class_from_type = reinterpret_cast<class_from_type_t>(GetProcAddress(asmMod, "il2cpp_class_from_type"));
    class_get_method_from_name = reinterpret_cast<class_get_method_from_name_t>(GetProcAddress(asmMod, "il2cpp_class_get_method_from_name"));
    class_get_property_from_name = reinterpret_cast<class_get_property_from_name_t>(GetProcAddress(asmMod, "il2cpp_class_get_property_from_name"));
    class_from_il2cpp_type = reinterpret_cast<class_from_il2cpp_type_t>(GetProcAddress(asmMod, "il2cpp_class_from_il2cpp_type"));
    class_get_methods = reinterpret_cast<class_get_methods_t>(GetProcAddress(asmMod, "il2cpp_class_get_methods"));
    class_get_field_from_name = reinterpret_cast<class_get_field_from_name_t>(GetProcAddress(asmMod, "il2cpp_class_get_field_from_name"));
    field_get_value = reinterpret_cast<field_get_value_t>(GetProcAddress(asmMod, "il2cpp_field_get_value"));
    field_get_value_object = reinterpret_cast<field_get_value_object_t>(GetProcAddress(asmMod, "il2cpp_field_get_value_object"));
    type_get_object = reinterpret_cast<type_get_object_t>(GetProcAddress(asmMod, "il2cpp_type_get_object"));
    runtime_invoke = reinterpret_cast<runtime_invoke_t>(GetProcAddress(asmMod, "il2cpp_runtime_invoke"));
    runtime_invoke_convert_args = reinterpret_cast<runtime_invoke_convert_args_t>(GetProcAddress(asmMod, "il2cpp_runtime_invoke_convert_args"));
    string_new = reinterpret_cast<string_new_t>(GetProcAddress(asmMod, "il2cpp_string_new"));
    thread_attach = reinterpret_cast<thread_attach_t>(GetProcAddress(asmMod, "il2cpp_thread_attach"));
    value_box = reinterpret_cast<value_box_t>(GetProcAddress(asmMod, "il2cpp_value_box"));
    object_new = reinterpret_cast<object_new_t>(GetProcAddress(asmMod, "il2cpp_object_new"));
    object_unbox = reinterpret_cast<object_unbox_t>(GetProcAddress(asmMod, "il2cpp_object_unbox"));
    runtime_object_init = reinterpret_cast<runtime_object_init_t>(GetProcAddress(asmMod, "il2cpp_runtime_object_init"));
    class_get_fields = reinterpret_cast<class_get_fields_t>(GetProcAddress(asmMod, "il2cpp_class_get_fields"));
    
    domain = domain_get(); // Get the current IL2CPP domain


    // Allocate a console for debugging output
    AllocConsole();
    FILE* console;
    freopen_s(&console, "CONOUT$", "w", stdout); // Redirect stdout to console
    freopen_s(&console, "CONIN$", "r", stdin); // Redirect stdin to console
    cout.clear(); // Clear the output stream

    thread_attach(domain); // Attach the current thread to the IL2CPP domain
    // Get the Il2CppImage for the UnityEngine assembly
    Il2CppImage* asmImg = GetImageByName("UnityEngine"); // we have to change this depending on what we want to do or get more images use il2cpp dumper to get dummy dlls to know what to use
    if (!asmImg) {
        printf("Assembly-CSharp image not found");
        return;
    }
    Il2CppClass* cameraClass = class_from_name(asmImg, "UnityEngine", "Camera"); // Getting the camera class from the UnityEngine namespace
    if (!cameraClass) {
        printf("Camera class not found.");
        return;
    }
    MethodInfo* getMainCamera = class_get_method_from_name(cameraClass, "get_main", 0); // getting the get main method from the camera class
    if (!getMainCamera) {
        printf("get_main method not found.");
        return;
    }
    Il2CppException* exception = nullptr;
    Il2CppObject* mainCamera = runtime_invoke(getMainCamera, nullptr, nullptr, &exception); // calling the get main function

    if (exception) {
        printf("Exception occurred while getting main camera.");
        return;
    }

    if (!mainCamera) {
        printf("Main camera is null.");
        return;
    }
    MethodInfo* setFOVMethod = class_get_method_from_name(cameraClass, "set_fieldOfView", 1); // getting the set field of view function
    if (!setFOVMethod) {
        printf("set_fieldOfView method not found.");
        return;
    }
    while (true) { // while loop to spam the change so we know it worked
        Sleep(10);
        // Set a new field of view
        float newFOV = 90.0f;
        void* args[1];
        args[0] = &newFOV;

        runtime_invoke(setFOVMethod, mainCamera, args, &exception); // calling the set field of view function

        if (exception) {
            printf("Exception occurred while setting field of view.");
        }
        else {
            printf("FOV Set");
        }
    }
}

BOOL APIENTRY DllMain(HMODULE hModule, DWORD ul_reason_for_call, LPVOID lpReserved)
{
    switch (ul_reason_for_call)
    {
    case DLL_PROCESS_ATTACH:
        CreateThread(NULL, 0, (LPTHREAD_START_ROUTINE)Init, NULL, 0, NULL); // Creates a thread to our Init function
        break;
    case DLL_THREAD_ATTACH:
    case DLL_THREAD_DETACH:
    case DLL_PROCESS_DETACH:
        break;
    }
    return TRUE;
}
```
### Explaining the code
> This will provide a brief run down of the steps the code is taking, and the reasons behind it. The code itself is commented heavily to explain what is happening at each step, but if you want a more indepth understanding you will have to do research yourself.
1. Include Libraries: Imports necessary headers for IL2CPP interaction.
2. Define Types: Creates type definitions for IL2CPP functions.
3. Declare Function Pointers: Inline declarations for IL2CPP function pointers to avoid duplicates.
4. Global Variables: Initializes variables for the assembly module, IL2CPP domain, assembly count, and list.
5. Retrieve Image Function: Defines GetImageByName to get an IL2CPP image by assembly name.
6. Initialization:
    - Gets GameAssembly.dll handle.
    - Retrieves IL2CPP function addresses.
    - Acquires the IL2CPP domain.
    - Sets up a console for debugging.
    - Attaches the thread to the IL2CPP domain.
    - Gets the UnityEngine image and retrieves the Camera class and get_main method.
7. Adjust Field of View:
    - Checks for null pointers/exceptions.
    - Retrieves and invokes set_fieldOfView in a loop to set FOV to 90.0f every 10 ms, handling exceptions.
8. DLL Entry Point: In DllMain, creates a thread to run Init when the DLL is attached to a process.

## Step 5: Building the Project
1. Hover over build
2. Then choose build solution
3. Once completed it will provide you with a directory as to where it stored our program. Remember where this is as we will use it later.

## Conclusion
- This covers making our actual IL2CPP Base DLL that we will be injecting into a IL2CPP Unity game.
- It is like you are scripting inside of the Unity Engine itself at this point, as you can see in the above example I showed how to get the camera class and change fov, you can find more stuff like this  within the unity docs.
- You can find more information about the Unity API [here](https://docs.unity3d.com/ScriptReference/)
- Now if you want to call game functions that arent base unity functions keep in mind they may have there own types and signatures that you will need to reverse engineer on your own similar to how we typedefed the il2cpp functions. It all depends so I cant walk you through that.
- I have a slightly more advanced source code available [here](https://github.com/jakeyboi1/IL2CPPBase)
