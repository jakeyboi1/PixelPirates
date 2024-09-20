# Hacking Mono Unity Games Writeup

> This guide provides a step-by-step approach to hacking Mono Unity games, specifically using The Forest as an example. The concepts and techniques discussed here are applicable to any Mono Unity game.

# Introduction
> Hacking Unity Mono games can be straightforward with the right tools and knowledge. This writeup will walk you through the process of creating a cheat using C# and injecting it into the game via a C++ DLL.

# Understanding The Basics

### What is Mono?
1. Mono is an open source development platform based on the .NET Framework, which allows developers to build cross-platform applications.
	- It accomplishes this with a JIT (Just in Time) compiler
		- This works by taking code from C# for example, and translating it to a language the computer can understand at runtime.
2. It can be embedded within programs

### What Is DLL Injection?
DLL Injection is a method used for runnning code within the address space of another process by forcing it to load a dynamic-link library or DLL.

### Why Are These Important?
By embedding Mono in a C++ DLL, we can instruct the Unity game to run our C# cheat code. This cheat can manipulate game objects, execute custom functions or use existing game functions.

# Tools Needed:
- [dnSpy](https://github.com/dnSpyEx/dnSpy)
- [Process Hacker](https://sourceforge.net/projects/processhacker/) (Or any .dll injector)
- [Visual Studio Community 2022](https://visualstudio.microsoft.com/vs/)

# Credits:
- [Beginners Guide Hacking Unity Games](https://www.unknowncheats.me/forum/general-programming-and-reversing/285864-beginners-guide-hacking-unity-games.html)
- [Mono Unity Injector](https://www.unknowncheats.me/forum/unity/268053-mono-unity-injector.html)

# Step by Step Process:
### Step 1: Preparing Your Enviornment
1. Install dnSpy
2. Determine The .NET Version:
	- Use dnSpy to open a DLL from the game's Managed folder. Look for the Runtime version (e.g., .NET Framework 3.5 for The Forest).

### Step 2: Creating The C# DLL Cheat
1. Open Visual Studio and create a new project:
	- Choose Class Library (.NET Framework)
	- Select the appropriate .NET version for your game
2. Add references:
	- Hover over project at the top, then choose the add reference option, then click browse in the window it displays, then click browse at the bottom right to open your files, Navigate to your games Managed folder and add the .dll files you require, to start add the Assembly-CSharp.dll file.
	- An example of what the path to the games Managed folder should look like: C:\Program Files (x86)\Steam\steamapps\common\The Forest\TheForest_Data\Managed
3. Coding the cheat:
	- Enter the following code:
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
			public void Update()
			{
				// This function is called every frame
			}

			public void OnGUI()
			{
				// This function handles GUI related things
				GUI.Label(new Rect(10, 10, 200, 40), "Cheat Activated!");
			}
		}
	}
	```
	- Base functionality: This code creates a persistent GameObject that displays a message on the screen, confirming that the cheat is active.
	- Class Structure Explanation: We have 2 classes one named Loader and one named hack. The loader class is what we will actually inject into our game, which will then create a game object for our hack class to run on. The hack class is where we code our actual cheat in.
	- The Methods Explanation: The methods in the hack class named: Update, and OnGUI are all built in functions within unity see [here](https://docs.unity3d.com/ScriptReference/MonoBehaviour.html) for more information.
	- What is GUI.Label: Where to learn more about the Gui.Label function from [here](https://docs.unity3d.com/ScriptReference/GUI.html).

### Step 3: Creating our C++ Mono Injector
1. Create a new Dynamic-Link Library (DLL) project in Visual Studio
2. Implement injector code:
	- Use the following code:
	``` cpp
	// dllmain.cpp : Defines the entry point for the DLL application.
	#include "pch.h"
	#include <windows.h>
	#include <iostream>

 	// Added to remove need for mono headers
	typedef VOID MonoObject;
	typedef VOID MonoDomain;
	typedef VOID MonoAssembly;
	typedef VOID MonoImage;
	typedef VOID MonoClass;
	typedef VOID MonoMethod;
	typedef VOID MonoImageOpenStatus;

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
	- Adjust the following: Change ASSEMBLY_PATH and PAYLOAD_NAMESPACE to match your project setup.
### Step 4: Compiling and injecting
1. Build both projects:
	- In Visual Studio, go to Build > Build Solution for both the C# and C++ projects.
2. Copy the C# .dll:
	- Locate your C# DLL in the project folder (e.g., under x64 Debug) and copy it to the game’s Managed folder.
3. Launch the game:
	- Start your game and wait until you are fully loaded in.
4. Inject the .dll:
	- Open Process Hacker, find your game process, right-click, and select Miscellaneous > Inject DLL. Navigate to your C++ DLL injector file and select it.

# Conclusion
If all steps were followed correctly, you should see the "Cheat Activated!" message in the top corner of your game. Now, you can start exploring and creating your own cheats! Use dnSpy to discover game functions and data, especially in the Assembly-CSharp.dll file.

# Ethical Disclaimer
This writeup is meant for educational purposes only.
