# Injecting our Cheat
> So we have made everything we need to make, this will go over actually injecting our cheat!

## Step 1: Preparing our Files
> So when you built each project I told you that it would give you an output directory of where it built your project, and to remember it. This is where we will be using that.
1. Navigate to where our MonoLoader project (Step 3's project) built too
2. Inside it should be a file named MonoLoader.dll copy it
3. Navigate to where our MonoInjector project (Step 2's project) built too
4. Paste the copied MonoLoader.dll into where our MonoInjector project built too
5. Navigate to where our C# Cheat project (Step 4's project) built too
6. There will be a file named (in my case) TestCheat.dll (This will depend on what you named your project) copy this file
7. Navigate to your games Managed folder and paste the copied TestCheat.dll (Whatever your file is called) into the Managed folder

## Step 2: Launch Your Game
1. Launch the game you want to cheat
2. Wait until you are fully loaded into the game and playing

## Step 4: Injecting our Cheat
1. Navigate to where MonoInjector project (Step 2's project) built too
2. In this folder you will see a .exe file named MonoInjector run this file
3. It will then ask you to input the window name of your game in my case the window name is TheForest (This will change for each game hover over your games window in your bottom bar to get the window name) input the name and press enter
4. Then a new command prompt will appear
5. It will ask you for the name of the .dll file we want to inject into our game. This will depend on what you named your Step 4 Project, in my case this  will be TestCheat.dll
6. It will then ask your for the name of the .dll's namespace if you copied the code from Step 4 where we made our cheat DLL this will be TestCheat otherwise it will be whatever you set it to be. Input the name and press enter
7. It will then ask you for the name of the .dll's loader class if you copied the code from Step 4 where we made our cheat DLL this will be Loader otherwise it will be whatever you set it to be. Input the name and press enter
8. It will then ask you for the main function within the .dll's loader. If you copied the code from Step 4 where we made our cheat DLL this will be Init otherwise it will be whatever you set it to be. Input the name and press enter

## Conclusion
> If you did everything right you should now see Cheat Activated! in the top left of your screen, if not you missed a step or made a mistake.
That is all there is to this guide you are now fully equipped to hack any Mono Unity game that exists. I hope you learned a lot, and continue to research this topic. I have had quite a lot of fun researching and learning about this.