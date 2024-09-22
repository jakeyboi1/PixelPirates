# Introduction to Hacking Mono Unity Games
> Welcome this is the first step in hacking Mono Unity Games.

## What this will cover:
1. This will describe the basic information needed to even begin hacking Mono Unity games.
2. This will include the tools needed to hack Mono Unity Games.
3. This will go over some prerequisites that you must have before starting.

## Basic Information:
### Disclaimers:
1. The information provided in this writeup is solely for educational pruposes.
2. This writeup contains no information for bypassing anti-cheats or preventing detection. I hack offline games, hacking online games ruins peoples enjoyment, and in my opinion is a shitty thing to do.
3. This writeup will only work on Windows, and I can only confirm it on Windows 11, but I assume it works on Windows 10 aswell.

### What is Unity?
1. Unity is a popular game engine. It has made countless popular games notably: Esccape From Tarkov, Rust and many more.
2. Unity has 2 methods of compiling your C# code to code the computer can understand.
    - IL2CPP I will not describe this as this writeup is for mono games, but I thought it important to mention.
    - Mono

### What is Mono?
> So we know Unity uses Mono to compile some of its games, but what is Mono?
- Mono is an open source development platform based on the .NET Framework, which allows developers to build cross-platform applications.
    - It accomplishes this with a JIT (Just in Time) compiler
    - This works by taking code from C# for example, and translating it to a language the computer can understand at runtime.
    - Note Mono also has a AOT (Ahead of Time) compiler but this is not important for this writeup
- Mono can also be embedded within programs or .dll files. This is important as this is how we will hack mono games.
- Note mono games are easier to hack than IL2CPP games (In my opinion)

### What is DLL injection?
DLL Injection is a method used for runnning code within the address space of another process by forcing it to load a dynamic-link library or DLL.

## Tools Required:
- [dnSpy](https://github.com/dnSpyEx/dnSpy)
- [Visual Studio Community 2022](https://visualstudio.microsoft.com/vs/)

## Prerequisites:
> These are things you must have before even attempting to hack Mono Unity games.
- An understanding of programming, and programming principles. This does not have to be with C++ or C# I for example have little experience with these langauges but because I have programmed for years with many languages I can adapt to use them without much difficulty because I know the base concepts of programming.
- A desire to learn. This stuff is very hard, and uses low level knowledge. It will take time to understand.
- Be okay with using AI ChatGPT will be your best friend, for explaining these often hard to find topics. Just do not use it to copy paste use it to actually learn.

## Credits:
> These are resources that I used to learn hacking Mono Unity games
- [Beginners Guide Hacking Unity Games](https://www.unknowncheats.me/forum/general-programming-and-reversing/285864-beginners-guide-hacking-unity-games.html)
- [Mono Unity Injector](https://www.unknowncheats.me/forum/unity/268053-mono-unity-injector.html)
