# Making our DLL Injector
> This will go over making our DLL Injector which will inject our MonoLoader.dll (We make this in the next step)

## Step 1. Create our Visual Studio Project
1. Open Visual Studio Community 2022
2. Create a new project
3. Choose a C++ Console App as the template
4. Click Next
5. Name it MonoInjector
6. Change the location to wherever you want to store it
7. Make sure to check the box that says "Place solution and project in the same directory"
8. Click create

## Step 2: Preparing our Project
1. Hover over project in the top
2. Then click MonoInjector Properties
3. Then go to advanced
4. Change the character set to a multibyte character set
5. Click apply then click ok
6. Remove all the premade code inside of the MonoInjector.cpp

## Step 3: The Code
1. I will now send the code for the injector, type this code into your project or copy paste it.
``` cpp
#include <iostream>
#include <Windows.h>
using namespace std;

// Helper functions

// This function retrieves the process ID of the window with the given title.
void getProcId(const char* windowTitle, DWORD& processId) {
    GetWindowThreadProcessId(FindWindow(NULL, windowTitle), &processId);
}

// This function shows an error message in a message box and exits the program with code -1.
void error(const char* error_title, const char* error_message) {
    MessageBox(NULL, error_message, error_title, NULL);
    exit(-1); // Closes the program with a code of negative 1 (error)
}

// This function checks if a file exists on the disk.
bool fileExists(string fileName) {
    struct stat buffer; // Creates a stat buffer to check file info
    return (stat(fileName.c_str(), &buffer) == 0); // Returns true if file exists, false otherwise
}

// Main code
int main()
{
    // Ask the user for the title of the game window
    char gameWindowTitleInput[100]; // Buffer to store the input window title
    cout << "Input the window title of your game: \n";
    cin.getline(gameWindowTitleInput, 100); // Reads the input window title
    const char* gameWindowTitle = gameWindowTitleInput; // Store the input as a constant char pointer
    cout << "\n";

    // Initialize process ID and path variables
    DWORD procId = NULL; // Will hold the process ID of the target window
    TCHAR dllPath[MAX_PATH]; // Buffer for storing the full path of the DLL
    const char* dllName = "MonoLoader.dll"; // Name of the DLL to inject

    // Check if the DLL file exists
    if (!fileExists(dllName)) {
        error("fileExists", "File does not exist"); // Show error if file doesn't exist
    }

    // Get the full path of the DLL file
    if (!GetFullPathName(dllName, MAX_PATH, dllPath, nullptr)) {
        error("GetFullPathName", "Failed to get full path of dll"); // Show error if full path retrieval fails
    }

    // Get the process ID of the game window
    getProcId(gameWindowTitle, procId);
    if (procId == NULL) {
        error("getProcId", "Failed to get process id"); // Show error if process ID retrieval fails
    }

    // Open a handle to the target process with all access rights
    HANDLE procHandle = OpenProcess(PROCESS_ALL_ACCESS, NULL, procId);
    if (!procHandle) {
        error("OpenProcess", "Failed to open a handle to process"); // Show error if unable to open process handle
    }

    // Allocate memory in the target process for the DLL path
    void* allocatedMem = VirtualAllocEx(procHandle, nullptr, MAX_PATH, MEM_RESERVE | MEM_COMMIT, PAGE_READWRITE);
    if (!allocatedMem) {
        error("VirtualAllocex", "Failed to allocate memory"); // Show error if memory allocation fails
    }

    // Write the full DLL path into the allocated memory of the target process
    if (!WriteProcessMemory(procHandle, allocatedMem, dllPath, MAX_PATH, nullptr)) {
        error("WriteProcessMemory", "Write process memory failed"); // Show error if writing memory fails
    }

    // Create a remote thread in the target process to load the DLL using LoadLibraryA
    HANDLE h_thread = CreateRemoteThread(procHandle, nullptr, NULL, LPTHREAD_START_ROUTINE(LoadLibraryA), allocatedMem, NULL, nullptr);
    if (!h_thread) {
        error("CreateRemoteThread", "Failed to create remote thread"); // Show error if remote thread creation fails
    }

    // Clean up: Close the handle to the process and free the allocated memory
    CloseHandle(procHandle);
    VirtualFreeEx(procHandle, allocatedMem, NULL, MEM_RELEASE);
}
```
### Explaining the code
> This will provide a brief run down of the steps the code is taking, and the reasons behind it. The code itself is commented heavily to explain what is happening at each step, but if you want a more indepth understanding you will have to do research yourself.
- Retrieve Process ID: It gets the process ID of a game window based on the title provided by the user.
- Check DLL Existence: It checks if the DLL (MonoLoader.dll) exists on the disk.
- Get DLL Path: It retrieves the full file path of the DLL.
- Open Process: It opens a handle to the target game's process with full access.
- Allocate Memory: It allocates memory in the target process for the DLL path.
- Write DLL Path: It writes the DLL path into the allocated memory of the target process.
- Inject DLL: It creates a remote thread in the target process to load the DLL using LoadLibraryA.
- Cleanup: It closes the process handle and frees the allocated memory after injection.

## Step 4: Building the Project
1. Hover over build
2. Then choose build solution
3. Once completed it will provide you with a directory as to where it stored our program. Remember where this is as we will use it later.

## Conclusion
- This covers making a simple DLL injector for our Mono Injector.
- This DLL injector will be what actually injects our MonoLoader.dll that we will make next.
- A lot of the functions used in the code for this are Windows API functions which you can learn more about [here](https://learn.microsoft.com/en-us/windows/win32/api/)