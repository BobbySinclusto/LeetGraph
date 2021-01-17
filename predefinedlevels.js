// a collection of predefined levels

level1 = 
{
    "Input (unsorted list)":[[],["Split list"]],
    "Split list":[["Input (unsorted list)"],["Sort one half", "Sort the other half"]],
    "Sort one half":[["Split list"],["Merge sorted lists"]],
    "Sort the other half":[["Split list"],["Merge sorted lists"]],
    "Merge sorted lists":[["Sort one half", "Sort the other half"],["Output"]],
    "Output":[["Merge sorted lists"],[]]
};

level2 =
{
    "Input (unsorted list)":[[],["Sort list"]],
    "Sort list":[["Input (unsorted list)"],["Split list"]],
    "Split list":[["Sort list"],["Choose list half that contains the element", "Choose list half that contains the element"]],
    "Choose list half that contains the element":[["Split list", "Split list"],["Output"]],
    "Output":[["Choose list half that contains the element"],[]]
};

level3 =
{
    "Reverse a string (String)":[[],["first character of current string","Reverse the (0,n-1) substring of string"]],
    "first character of current string":[["Reverse a string (String)"],[]],
    "Reverse the (0,n-1) substring of string" : [["Reverse a string (String)"] , []]
};

level4 =
{
    "Reverse a string (String)":[[],["first character of current string","Reverse the (0,n-1) substring of string"]],
    "first character of current string":[["Reverse a string (String)"],[]],
    "Reverse the (0,n-1) substring of string" : [["Reverse a string (String)"] , []]
};

all_levels = {
    "Problem 1" : [level1, "Use the block abstractions to sort a list!\nFor example [2,3,1,4] should be sorted to [1,2,3,4]"],
    "Problem 2" : [level2, "Use the blocks to implement binary search!"],
    "Problem 3" : [level3, "Use the blocks to reverse a string!"]
}

