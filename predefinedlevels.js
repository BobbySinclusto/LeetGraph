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

all_levels = {
    "Problem 1" : [level1, "Problem text"],
    "Problem 2" : [level2, "stuff"]
}

