# Sorting Algorithm Visualizer

A web-based application that visualizes different sorting algorithms with both visual and audio feedback. This tool helps to understand how various sorting algorithms work by providing a real-time, interactive visualization.

## Features

### Multiple Sorting Algorithms
- **Bubble Sort**: Repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order.
- **Selection Sort**: Finds the minimum element from the unsorted part and puts it at the beginning.
- **Insertion Sort**: Builds the final sorted array one item at a time by comparing each with the prior elements.
- **Merge Sort**: A divide and conquer algorithm that divides the array into two halves, sorts them, and then merges them.
- **Quick Sort**: Another divide and conquer algorithm that picks a pivot element and partitions the array around the pivot.

### Interactive Controls
- Adjust the number of elements to be sorted (10-150)
- Control the animation speed
- Generate new random arrays
- Toggle sound on/off

### Multi-sensory Feedback
- **Visual Representation**: Elements represented as bars with height proportional to their value
- **Color Coding**: Blue for unsorted, red for comparing, green for sorted
- **Audio Feedback**: Each element produces a unique sound based on its value during comparisons and swaps

### Algorithm Information
- Real-time statistics (comparisons, swaps, execution time)
- Time complexity information for each algorithm
- Space complexity information
- Brief descriptions of how each algorithm works

## How It Works

### Visual Representation
The application represents the array to be sorted as a series of vertical bars. The height of each bar corresponds to the value of the array element. As the sorting algorithm progresses, the bars are rearranged to reflect the changes in the array.

### Color Coding
- **Blue**: Default color for unsorted elements
- **Red**: Elements being compared or swapped
- **Green**: Elements that have been sorted into their final position

### Audio Representation
When enabled, the application generates sounds based on the values of the elements being processed:
- Higher values produce higher-pitched sounds
- Lower values produce lower-pitched sounds
- This creates an auditory pattern that represents the sorting process

### Algorithm Execution
1. When you select an algorithm, the visualization begins
2. The application steps through the algorithm, updating the visual representation at each step
3. Statistics are updated in real-time (comparisons, swaps, execution time)
4. Once the algorithm completes, all elements are marked as sorted

## Technical Implementation

### Data Structure
The application maintains an array of numbers that represents the data to be sorted. This array is visualized as a series of bars in the DOM.

### Visualization Technique
- Uses CSS transitions for smooth animations
- DOM manipulation to update the visualization
- Web Audio API for generating sounds

### Algorithms
All sorting algorithms are implemented using async/await to control the timing of the visualization:
- Each comparison and swap is visualized with a delay
- The delay duration can be adjusted using the speed control

## Credits

Project based in the sound of sorting project here[https://panthema.net/2013/sound-of-sorting/] 


