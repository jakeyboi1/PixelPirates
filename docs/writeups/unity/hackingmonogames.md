# Hacking Mono Unity Games Writeup

> This was written and tested on The Forest but will work the exact same for any Mono Unity game.

## So hacking Unity Mono games is fairly straight forward. Lets go over some of the base concepts before I get into the steps of how I went about it.

- What is Mono? Mono is a JIT (Just in time) compiler. The reason this is great is Mono is installable and better yet we can embed it within our own code.

- What is Injecting? Injecting is the process of injecting in our case .dll files that we want our program to run.

- Why are these 2 things important? Well we use Mono embedded in a C++ .dll file that uses embedded Mono to tell our Unity Mono game to run a C# .dll file that has a loader and hack class within it. This loader class will then create a game object and set it to not destroyable so its permanent. Then our hack class inherits Monobehavior from unity and then runs its method Start() which engages our cheat.

# The tools used for this:
- DNS Spy
- Process Hacker
- Visual Studio Community 2022 (make sure to install unity c++ and any other of the initial install options you have (I did all to be safe))
- Mono (Included as a tool because we install it from there site and use its included headers to embed Mono in our C++ .dll file)

# Credits:
- https://www.unknowncheats.me/forum/general-programming-and-reversing/285864-beginners-guide-hacking-unity-games.html
- https://www.unknowncheats.me/forum/unity/268053-mono-unity-injector.html (I got the Mono injector from here as I wanted an open source one to dig into and understand i did not write my own yet, but I may in future as for now I am happy with this open source one. As such this writeup will not contain much regarding the injector besides the small change to set the right names and directories.)

# The process:
> Before even starting:
- Install Mono and DNS Spy
- Find out what version of .net your game uses in my case The Forest uses .net 3.5. You have to use the same .net version in your C# .dll cheat or it will not work. You can do this with DNS Spy opening a .dll from the games Managed folder and clicking it, in the right side window you will see a comment that says Runtime: .NET Framework 3.5 (3.5 will change depending on the game that is your version)

> Making our C# .dll cheat:
- Create our Class Library (.NET Framework) project this is the exact name that you want to look for when making your project make sure you choose the correct version of .NET for your game.
- Once made and loaded in, hover over project in the top and then choose the add reference option then click browse in the window it displays then browse again to open your files. Navigate to your games Managed folder here is an example directory for my game: C:\Program Files (x86)\Steam\steamapps\common\The Forest\TheForest_Data\Managed once there add every single .dll file except mscorlib.dll and all system dlls.
- I will attach code below giving a fully functional cheat class that displays a message in the top right of your screen, I will explain the code below.

``` c#
using UnityEngine;

namespace TheForestCheato
{
    public class Loader
    {
        public static void Init()
        {
            Loader.load = new GameObject();
            Loader.load.AddComponent<hack>();
            UnityEngine.Object.DontDestroyOnLoad(Loader.load);
        }
        private static GameObject load;
    }

    public class hack : MonoBehaviour
    {
        public void Start()
        {
            OnGUI();
        }

        public void Update()
        {
            //
        }

        public void OnGUI()
        {
            GUI.Label(new Rect(10, 10, 200, 40), "Cheat Activated!");
        }
    }
}
```
- This is creating a namespace called TheForestCheato with 2 classes inside of it. One class the loader has a method named Init this init method is what is injected into our game and it creates a gameobject for our cheat class to run on and tells Unity's garbage collector to not destroy it making it permanent. The second class named hack is our actual cheat. It has 3 methods within it all of these methods are default methods in the Unity engine. The Start method is called initially and triggers OnGUI which draws our text on the top right of our screen letting us know our cheat worked.
- For this simple writeup I will not go any more in depth with this code or what all you can do check the Unity docs and do your research you have access to litrally the entire engine and all methods within the game. You can modify ANYTHING you essentially have a verified .dll that the game will run and execute all code within it.

> Making our C++ .dll Mono Injector:
- This part will not be super in depth as I stated above in the credits I did not write this. I found it and it was open source. I will go over the few things you will need to change depending on what you do.
- Create our Dynamic-Link Library (DLL) project. Then once loaded into it hover over project then go to YourProjectName Properties option and then go to C/C++ then in the option Additional Include Directories add our path to Mono includes here is an example directory (This will depend on where you installed Mono): C:\Program Files\Mono\include\mono-2.0
- I will send the code below
``` cpp
// dllmain.cpp : Defines the entry point for the DLL application.
#include "pch.h"
#include <windows.h>
#include <iostream>
#include <mono/jit/jit.h>

#define ASSEMBLY_PATH "/TheForestCheato.dll" // Change to your file name (this depends on what you named your project)
#define PAYLOAD_NAMESPACE "TheForestCheato" // Change to your namespace (This will depend on what your namespace in your C# code is)
#define PAYLOAD_CLASS "Loader" // Leave same
#define PAYLOAD_MAIN "Init" // Leave same
#define MONO_DLL L"mono.dll" // Leave same

// typedefs and fields for required mono functions
typedef void(__cdecl* t_mono_thread_attach)(MonoDomain*);
t_mono_thread_attach fnThreadAttach;
typedef  MonoDomain* (__cdecl* t_mono_get_root_domain)(void);
t_mono_get_root_domain fnGetRootDomain;
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
typedef const char* (__cdecl* t_mono_assembly_getrootdir)(void);
t_mono_assembly_getrootdir fnGetRootDir;

void initMonoFunctions(HMODULE mono) {
	fnThreadAttach = (t_mono_thread_attach)GetProcAddress(mono, "mono_thread_attach");
	fnGetRootDomain = (t_mono_get_root_domain)GetProcAddress(mono, "mono_get_root_domain");
	fnAssemblyOpen = (t_mono_assembly_open)GetProcAddress(mono, "mono_assembly_open");
	fnAssemblyGetImage = (t_mono_assembly_get_image)GetProcAddress(mono, "mono_assembly_get_image");
	fnClassFromName = (t_mono_class_from_name)GetProcAddress(mono, "mono_class_from_name");
	fnMethodFromName = (t_mono_class_get_method_from_name)GetProcAddress(mono, "mono_class_get_method_from_name");
	fnRuntimeInvoke = (t_mono_runtime_invoke)GetProcAddress(mono, "mono_runtime_invoke");
	fnGetRootDir = (t_mono_assembly_getrootdir)GetProcAddress(mono, "mono_assembly_getrootdir");
}

void InjectMonoAssembly() {
	std::string assemblyDir;

	HMODULE mono;
	MonoDomain* domain;
	MonoAssembly* assembly;
	MonoImage* image;
	MonoClass* klass;
	MonoMethod* method;

	/* grab the mono dll module */
	mono = LoadLibraryW(MONO_DLL);
	/* initialize mono functions */
	initMonoFunctions(mono);
	/* grab the root domain */
	domain = fnGetRootDomain();
	fnThreadAttach(domain);
	/* Grab our root directory*/
	assemblyDir.append(fnGetRootDir());
	assemblyDir.append(ASSEMBLY_PATH);
	/* open payload assembly */
	assembly = fnAssemblyOpen(assemblyDir.c_str(), NULL);
	if (assembly == NULL) return;
	/* get image from assembly */
	image = fnAssemblyGetImage(assembly);
	if (image == NULL) return;
	/* grab the class */
	klass = fnClassFromName(image, PAYLOAD_NAMESPACE, PAYLOAD_CLASS);
	if (klass == NULL) return;
	/* grab the hack entrypoint */
	method = fnMethodFromName(klass, PAYLOAD_MAIN, 0);
	if (method == NULL) return;
	/* call our entrypoint */
	fnRuntimeInvoke(method, NULL, NULL, NULL);
}

BOOL APIENTRY DllMain( HMODULE hModule, DWORD  ul_reason_for_call, LPVOID lpReserved) {
    switch (ul_reason_for_call)
    {
    case DLL_PROCESS_ATTACH:
		InjectMonoAssembly();
        break; // Investigate Removing as may not be needed
    case DLL_THREAD_DETACH:
    case DLL_PROCESS_DETACH:
        break;
    }
    return TRUE;
}
```
- Change ASSEMBLY_PATH and PAYLOAD_NAMESPACE to the appropriate names you will have to figure this out as I do not know what you will name your stuff.

> Next steps:
- In both projects build them by hovering over Build then choosing Build solution. Where these files will go may depend on how you set them up but by default it should be in the projects folder under x64 Debug.
- copy the C# cheat .dll file and paste it into your games Managed folder do not rename it.
- Open your game and get loaded in
- Open process hacker
- In process hacker find your games process right click on it and then go to miscellaneous then inject DLL path it to your C++ .dll Mono injector file which will be in its project folder under x64 Debug.
- Tada you should now see the text in your game if you followed all the steps! That's it now build your awesome cheats! Use DNS Spy to find game functions and data (the most important .dll file is Assembly-CSharp.dll file thank me later)