# Making our Cheat DLL
> This will go over making our cheat DLL that we will be injecting into the game. This is where you will actually write your cheats themselves.

## Step 1: Determining the .NET Version
>  We must determin what .NET version our game is running on, as we will have to use the same .NET version for our project.
1. Open dnSpy
2. Click file at the top left, then click open
3. Browse to your games Managed folder
4. Choose the UnityEngine.dll file and click open
5. You will then see in the left side of your screen the UnityEngine file we opened
6. Open up the drop down menu
7. You will then see in purple UnityEngine.dll
8. Click on UnityEngine.dll not the drop down.
9. In the right side of your screen some text will appear.
10. In that texxt you will see Runtime: .NET Framework 3.5 (3.5 is the .NET version, this will change depending on the game)

## Step 2: Create our Visual Studio Project
1. Open Visual Studio Community 2022
2. Create a new project
3. Choose a C# Class Library (.NET Framework) as the template
4. Click Next
5. Name it whatever you want, for this example I will name it TestCheat
6. Change the location to wherever you want to store it
7. Make sure to check the box that says "Place solution and project in the same directory"
8. Make sure to set the Framework option to your games .NET version
    - If you do not have that version you will need to go install it. Simply google the version and you should be able to find it easily
9. Click create

## Step 3: Preparing our Project
1. Click Project then click the add reference option
2. Click Browse in the window it popped up and then click browse in the bottom right
3. Navigate to your games Managed folder, and choose the UnityEngine.dll and click add then click ok
4. Remove all the premade code

## Step 4: The Code
1. I will now send the code for the cheat, type this code into your project or copy paste it.
``` c#
using UnityEngine;  // Import the Unity engine's namespace from the refernce we added

namespace TestCheat  // Define the namespace for the project (Make sure this is the same as your overall projects name)
{
    public class Loader  // Class responsible for initializing the cheat (I reccommend leaving it named Loader for ease of use)
    {
        public static void Init()  // Static method to initialize the cheat loader (I reccommend leaving it named Loader for ease of use)
        {
            // Create a new GameObject to attach the cheat component to
            Loader.load = new GameObject();

            // Add the 'hack' component (defined below) to the GameObject
            Loader.load.AddComponent<hack>();

            // Prevent the GameObject from being destroyed when loading new scenes
            UnityEngine.Object.DontDestroyOnLoad(Loader.load);
        }

        // Private static variable to hold the reference to the GameObject
        private static GameObject load;
    }

    public class hack : MonoBehaviour  // Class responsible for the actual cheat behavior
    {
        public void Update()  // Update method called once per frame
        {
            // This function is called every frame, can be used for real-time logic
        }

        public void OnGUI()  // OnGUI method handles GUI elements
        {
            // Draw a label on the screen showing "Cheat Activated!"
            GUI.Label(new Rect(10, 10, 200, 40), "Cheat Activated!");
        }
    }
}
```
### Explaining the code
> This will provide a brief run down of the steps the code is taking, and the reasons behind it. The code itself is commented heavily to explain what is happening at each step, but if you want a more indepth understanding you will have to do research yourself.
- Loader class: Initializes the cheat by creating a new GameObject and adding the hack component to it. It ensures this object isn't destroyed when loading new scenes.
- hack class: Contains the actual cheat logic. The Update method can be used for actions that need to happen every frame, and OnGUI displays a label "Cheat Activated!" on the screen.

## Step 5: Building the Project
1. Hover over build
2. Then choose build solution
3. Once completed it will provide you with a directory as to where it stored our program. Remember where this is as we will use it later.

## Conclusion
- This covers making our actual Cheat DLL that we will be injecting into a Mono Unity game.
- This part is relatively straight forward and the easiest part of this process. At this point you have access to the entire game engine and functions withing the game. It is like you are scripting inside of the Unity Engine itself.
- You can find more information about the Unity API [here](https://docs.unity3d.com/ScriptReference/)
- To interact with in game functions that arent apart of Unity or other parts of Unity you will have to add more references to other .dll files within the Managed folder. This will depend on what game you are hacking, and what you want to do so you will have to explore this on your own and play around with it. Every .dll within the Managed folder except: any of the system .dlls and the mscorlib.dll do not add these
