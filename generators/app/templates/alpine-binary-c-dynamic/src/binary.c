#include <stdio.h>
#include <stdlib.h>
# include <string.h>
# include <ctype.h>
# include <math.h>
# include <time.h>
# include "flag.h"


// Code to accept password from user which shows the flag
// if password is HackingLab

int main()
{
    char password[100];
    printf("Enter the password as - HackingLab \n");
    scanf("%s", password);
    if (strcmp(password, "HackingLab") == 0)
    {
        printf("The flag is: %s ", flag);
    }
    else
    {
        printf("Wrong password");
    }

    return 0;
}





