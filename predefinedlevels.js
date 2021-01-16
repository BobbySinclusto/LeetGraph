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


all_levels = {
    "Problem 1" : [level1 , "Problem text"]
}

