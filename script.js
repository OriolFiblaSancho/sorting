// DOM Elements
const arrayContainer = document.getElementById('array-container');
const arraySizeInput = document.getElementById('arraySize');
const arraySizeValue = document.getElementById('arraySizeValue');
const speedInput = document.getElementById('speed');
const generateArrayBtn = document.getElementById('generateArray');
const algorithmButtons = document.querySelectorAll('.algo-btn');
const currentAlgorithmElement = document.getElementById('currentAlgorithm');
const comparisonsElement = document.getElementById('comparisons');
const swapsElement = document.getElementById('swaps');
const timeElement = document.getElementById('time');
const timeComplexityElement = document.getElementById('timeComplexity');
const spaceComplexityElement = document.getElementById('spaceComplexity');

// Global variables
let array = [];
let arrayBars = [];
let timeouts = [];
let isSorting = false;
let comparisons = 0;
let swaps = 0;
let startTime = 0;

// Audio context for sound feedback
let audioContext;
let isMuted = false;

// Algorithm complexity information
const complexityInfo = {
    bubble: {
        time: 'Best: O(n) | Average: O(n²) | Worst: O(n²)',
        space: 'O(1)',
        description: 'Bubble Sort repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.'
    },
    selection: {
        time: 'Best: O(n²) | Average: O(n²) | Worst: O(n²)',
        space: 'O(1)',
        description: 'Selection Sort finds the minimum element from the unsorted part and puts it at the beginning.'
    },
    insertion: {
        time: 'Best: O(n) | Average: O(n²) | Worst: O(n²)',
        space: 'O(1)',
        description: 'Insertion Sort builds the final sorted array one item at a time by comparing each with the prior elements.'
    },
    merge: {
        time: 'Best: O(n log n) | Average: O(n log n) | Worst: O(n log n)',
        space: 'O(n)',
        description: 'Merge Sort is a divide and conquer algorithm that divides the array into two halves, sorts them, and then merges them.'
    },
    quick: {
        time: 'Best: O(n log n) | Average: O(n log n) | Worst: O(n²)',
        space: 'O(log n)',
        description: 'Quick Sort is a divide and conquer algorithm that picks an element as pivot and partitions the array around the pivot.'
    }
};

// Initialize application
function init() {
    updateArraySizeDisplay();
    generateNewArray();
    addEventListeners();
    
    // Initialize Audio Context on first user interaction
    document.addEventListener('click', function initAudioOnFirstClick() {
        initAudio();
        document.removeEventListener('click', initAudioOnFirstClick);
    }, { once: true });
}

// Event Listeners
function addEventListeners() {
    generateArrayBtn.addEventListener('click', generateNewArray);
    
    arraySizeInput.addEventListener('input', () => {
        updateArraySizeDisplay();
        generateNewArray();
    });
    
    // Sound toggle button
    const toggleSoundBtn = document.getElementById('toggleSound');
    toggleSoundBtn.addEventListener('click', () => {
        toggleMute();
        toggleSoundBtn.innerHTML = isMuted ? '🔇 Sound Off' : '🔊 Sound On';
        
        // Initialize audio context if it's the first time turning on sound
        if (!isMuted && (!audioContext || audioContext.state === 'suspended')) {
            initAudio();
        }
    });
    
    algorithmButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (isSorting) return;
            
            const algorithm = button.getAttribute('data-algorithm');
            resetStats();
            updateAlgorithmInfo(algorithm);
            
            // Start sorting visualization
            isSorting = true;
            disableControls(true);
            startTime = performance.now();
            
            switch (algorithm) {
                case 'bubble':
                    bubbleSort();
                    break;
                case 'selection':
                    selectionSort();
                    break;
                case 'insertion':
                    insertionSort();
                    break;
                case 'merge':
                    mergeSort();
                    break;
                case 'quick':
                    quickSort();
                    break;
            }
        });
    });
}

// Generate a new random array
function generateNewArray() {
    clearTimeouts();
    resetStats();
    
    const arraySize = parseInt(arraySizeInput.value);
    array = [];
    
    for (let i = 0; i < arraySize; i++) {
        array.push(randomIntFromInterval(5, 100));
    }
    
    renderArray();
    disableControls(false);
    isSorting = false;
}

// Render array as bars
function renderArray() {
    arrayContainer.innerHTML = '';
    arrayBars = [];
    
    const maxValue = Math.max(...array);
    const barWidth = Math.max(2, Math.floor((arrayContainer.clientWidth - array.length) / array.length));
    
    for (let i = 0; i < array.length; i++) {
        const bar = document.createElement('div');
        bar.className = 'array-bar';
        const height = (array[i] / maxValue) * (arrayContainer.clientHeight - 20);
        
        bar.style.height = `${height}px`;
        bar.style.width = `${barWidth}px`;
        
        arrayContainer.appendChild(bar);
        arrayBars.push(bar);
    }
}

// Helper functions
function updateArraySizeDisplay() {
    arraySizeValue.textContent = arraySizeInput.value;
}

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function sleep(ms) {
    return new Promise(resolve => {
        const timeout = setTimeout(resolve, ms);
        timeouts.push(timeout);
    });
}

function getAnimationSpeed() {
    return 101 - parseInt(speedInput.value);
}

function clearTimeouts() {
    timeouts.forEach(timeout => clearTimeout(timeout));
    timeouts = [];
}

function disableControls(disable) {
    generateArrayBtn.disabled = disable;
    arraySizeInput.disabled = disable;
    speedInput.disabled = disable;
}

function resetStats() {
    comparisons = 0;
    swaps = 0;
    updateStats();
    
    // Reset bar colors
    if (arrayBars.length > 0) {
        arrayBars.forEach(bar => {
            bar.className = 'array-bar';
        });
    }
    
    // Reset algorithm info
    currentAlgorithmElement.textContent = 'Select an algorithm to start';
    timeComplexityElement.textContent = '-';
    spaceComplexityElement.textContent = '-';
}

function updateStats() {
    comparisonsElement.textContent = comparisons;
    swapsElement.textContent = swaps;
    if (startTime > 0 && isSorting) {
        const currentTime = performance.now();
        timeElement.textContent = Math.round(currentTime - startTime);
    }
}

function updateAlgorithmInfo(algorithm) {
    currentAlgorithmElement.textContent = `${algorithm.charAt(0).toUpperCase() + algorithm.slice(1)} Sort: ${complexityInfo[algorithm].description}`;
    timeComplexityElement.textContent = complexityInfo[algorithm].time;
    spaceComplexityElement.textContent = complexityInfo[algorithm].space;
}

function finishSorting() {
    isSorting = false;
    disableControls(false);
    const endTime = performance.now();
    timeElement.textContent = Math.round(endTime - startTime);
}

// Sound functions
function initAudio() {
    try {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        audioContext = new AudioContext();
    } catch (e) {
        console.warn('Web Audio API is not supported in this browser');
    }
}

function playSound(frequency, duration) {
    if (isMuted || !audioContext) return;
    
    try {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration / 1000);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + duration / 1000);
    } catch (e) {
        console.error('Error playing sound:', e);
    }
}

function toggleMute() {
    isMuted = !isMuted;
}

// Visualize comparisons and swaps
async function visualizeCompare(i, j) {
    arrayBars[i].classList.add('comparing');
    arrayBars[j].classList.add('comparing');
    
    comparisons++;
    updateStats();
    
    // Play sound based on element value
    const minFreq = 220;
    const maxFreq = 880;
    const normalizedValue = array[i] / 100;
    const frequency = minFreq + normalizedValue * (maxFreq - minFreq);
    playSound(frequency, 50);
    
    await sleep(getAnimationSpeed());
    
    arrayBars[i].classList.remove('comparing');
    arrayBars[j].classList.remove('comparing');
}

async function visualizeSwap(i, j) {
    // Update array
    [array[i], array[j]] = [array[j], array[i]];
    
    // Update DOM
    const tempHeight = arrayBars[i].style.height;
    arrayBars[i].style.height = arrayBars[j].style.height;
    arrayBars[j].style.height = tempHeight;
    
    swaps++;
    updateStats();
    
    // Play sound based on element value
    const minFreq = 220;
    const maxFreq = 880;
    const normalizedValue = array[j] / 100;
    const frequency = minFreq + normalizedValue * (maxFreq - minFreq);
    playSound(frequency, 100);
    
    await sleep(getAnimationSpeed());
}

async function visualizeArrayUpdate(idx, value) {
    const maxValue = Math.max(...array);
    const height = (value / maxValue) * (arrayContainer.clientHeight - 20);
    
    array[idx] = value;
    arrayBars[idx].style.height = `${height}px`;
    arrayBars[idx].classList.add('comparing');
    
    // Play sound based on element value
    const minFreq = 220;
    const maxFreq = 880;
    const normalizedValue = value / 100;
    const frequency = minFreq + normalizedValue * (maxFreq - minFreq);
    playSound(frequency, 50);
    
    await sleep(getAnimationSpeed());
    
    arrayBars[idx].classList.remove('comparing');
}

async function markSorted(start, end) {
    for (let i = start; i <= end; i++) {
        arrayBars[i].classList.add('sorted');
    }
}

// Sorting Algorithms Implementation
async function bubbleSort() {
    const n = array.length;
    
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            await visualizeCompare(j, j + 1);
            
            if (array[j] > array[j + 1]) {
                await visualizeSwap(j, j + 1);
            }
        }
        // Mark the last element in this pass as sorted
        arrayBars[n - i - 1].classList.add('sorted');
    }
    
    // Mark the first element as sorted (which is already in place)
    arrayBars[0].classList.add('sorted');
    
    finishSorting();
}

async function selectionSort() {
    const n = array.length;
    
    for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        
        for (let j = i + 1; j < n; j++) {
            await visualizeCompare(minIdx, j);
            
            if (array[j] < array[minIdx]) {
                minIdx = j;
            }
        }
        
        if (minIdx !== i) {
            await visualizeSwap(i, minIdx);
        }
        
        // Mark the element as sorted
        arrayBars[i].classList.add('sorted');
    }
    
    // Mark the last element as sorted
    arrayBars[n - 1].classList.add('sorted');
    
    finishSorting();
}

async function insertionSort() {
    const n = array.length;
    
    // Mark first element as sorted
    arrayBars[0].classList.add('sorted');
    
    for (let i = 1; i < n; i++) {
        const key = array[i];
        let j = i - 1;
        
        while (j >= 0) {
            await visualizeCompare(j, i);
            
            if (array[j] > key) {
                array[j + 1] = array[j];
                await visualizeArrayUpdate(j + 1, array[j]);
                j--;
                swaps++;
                updateStats();
            } else {
                break;
            }
        }
        
        array[j + 1] = key;
        await visualizeArrayUpdate(j + 1, key);
        
        // Mark elements as sorted
        for (let k = 0; k <= i; k++) {
            arrayBars[k].classList.add('sorted');
        }
    }
    
    finishSorting();
}

// Quick Sort Implementation
async function quickSort() {
    await quickSortHelper(0, array.length - 1);
    await markSorted(0, array.length - 1);
    finishSorting();
}

async function quickSortHelper(low, high) {
    if (low < high) {
        const pivotIndex = await partition(low, high);
        
        // Mark pivot as sorted
        arrayBars[pivotIndex].classList.add('sorted');
        
        await quickSortHelper(low, pivotIndex - 1);
        await quickSortHelper(pivotIndex + 1, high);
    }
}

async function partition(low, high) {
    const pivot = array[high];
    let i = low - 1;
    
    for (let j = low; j < high; j++) {
        await visualizeCompare(j, high);
        
        if (array[j] <= pivot) {
            i++;
            await visualizeSwap(i, j);
        }
    }
    
    await visualizeSwap(i + 1, high);
    return i + 1;
}

// Merge Sort Implementation
async function mergeSort() {
    await mergeSortHelper(0, array.length - 1);
    await markSorted(0, array.length - 1);
    finishSorting();
}

async function mergeSortHelper(left, right) {
    if (left < right) {
        const mid = Math.floor((left + right) / 2);
        
        await mergeSortHelper(left, mid);
        await mergeSortHelper(mid + 1, right);
        
        await merge(left, mid, right);
    }
}

async function merge(left, mid, right) {
    const n1 = mid - left + 1;
    const n2 = right - mid;
    
    // Create temp arrays
    const L = new Array(n1);
    const R = new Array(n2);
    
    // Copy data to temp arrays
    for (let i = 0; i < n1; i++) {
        L[i] = array[left + i];
    }
    for (let j = 0; j < n2; j++) {
        R[j] = array[mid + 1 + j];
    }
    
    // Merge the temp arrays back
    let i = 0, j = 0;
    let k = left;
    
    while (i < n1 && j < n2) {
        await visualizeCompare(left + i, mid + 1 + j);
        
        if (L[i] <= R[j]) {
            array[k] = L[i];
            await visualizeArrayUpdate(k, L[i]);
            i++;
        } else {
            array[k] = R[j];
            await visualizeArrayUpdate(k, R[j]);
            j++;
        }
        k++;
        swaps++;
        updateStats();
    }
    
    // Copy remaining elements of L[]
    while (i < n1) {
        array[k] = L[i];
        await visualizeArrayUpdate(k, L[i]);
        i++;
        k++;
        swaps++;
        updateStats();
    }
    
    // Copy remaining elements of R[]
    while (j < n2) {
        array[k] = R[j];
        await visualizeArrayUpdate(k, R[j]);
        j++;
        k++;
        swaps++;
        updateStats();
    }
}

// Initialize the application
window.addEventListener('load', init);
window.addEventListener('resize', renderArray);

// Initialize audio context
initAudio();
