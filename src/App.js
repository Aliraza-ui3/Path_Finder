import React, { useState, useEffect } from 'react';
import { dijkstra, getNodesInShortestPathOrder } from './components/DjistraAlgo';
import AnimatedCursor from "react-animated-cursor"
import './App.css';
import TutorialSlides from './components/Tutorial';

const START_NODE_ROW = 10;
const START_NODE_COL = 20;
const END_NODE_ROW = 10;
const END_NODE_COL = 35;

const createNode = (row, col, startNode, endNode) => {
    return {
        row,
        col,
        distance: Infinity,
        isVisited: false,
        isWall: false,
        isStart: row === startNode.row && col === startNode.col,
        isFinish: row === endNode.row && col === endNode.col,
        previousNode: null,
    };
};

const getInitialGrid = (startNode, endNode) => {
    const grid = [];
    const numRows = Math.floor(window.innerHeight / 25);
    const numCols = Math.floor(window.innerWidth / 25);
    for (let row = 0; row < numRows; row++) {
        const currentRow = [];
        for (let col = 0; col < numCols; col++) {
            currentRow.push(createNode(row, col, startNode, endNode));
        }
        grid.push(currentRow);
    }
    return grid;
};

const App = () => {
    const [startNode, setStartNode] = useState({ row: START_NODE_ROW, col: START_NODE_COL });
    const [endNode, setEndNode] = useState({ row: END_NODE_ROW, col: END_NODE_COL });
    const [grid, setGrid] = useState(getInitialGrid(startNode, endNode));
    const [mouseIsPressed, setMouseIsPressed] = useState(false);
    const [movingStart, setMovingStart] = useState(false);
    const [movingEnd, setMovingEnd] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setGrid(getInitialGrid(startNode, endNode));
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [startNode, endNode]);

    const handleMouseDown = (row, col) => {
        if (grid[row][col].isStart) {
            setMovingStart(true);
        } else if (grid[row][col].isFinish) {
            setMovingEnd(true);
        } else {
            const newGrid = getNewGridWithWallToggled(grid, row, col);
            setGrid(newGrid);
        }
        setMouseIsPressed(true);
    };

    const handleMouseEnter = (row, col) => {
        if (!mouseIsPressed) return;
        if (movingStart) {
            setStartNode({ row, col });
            const newGrid = getInitialGrid({ row, col }, endNode);
            setGrid(newGrid);
        } else if (movingEnd) {
            setEndNode({ row, col });
            const newGrid = getInitialGrid(startNode, { row, col });
            setGrid(newGrid);
        } else {
            const newGrid = getNewGridWithWallToggled(grid, row, col);
            setGrid(newGrid);
        }
    };

    const handleMouseUp = () => {
        setMouseIsPressed(false);
        setMovingStart(false);
        setMovingEnd(false);
    };

    const visualizeDijkstra = () => {
        const newGrid = grid.slice();
        const startNodeObj = newGrid[startNode.row][startNode.col];
        const endNodeObj = newGrid[endNode.row][endNode.col];
        const visitedNodesInOrder = dijkstra(newGrid, startNodeObj, endNodeObj);
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(endNodeObj);
        animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
    };

    const restartGrid = () => {
        window.location.reload();
    };

    const animateDijkstra = (visitedNodesInOrder, nodesInShortestPathOrder) => {
        for (let i = 0; i <= visitedNodesInOrder.length; i++) {
            if (i === visitedNodesInOrder.length) {
                setTimeout(() => {
                    animateShortestPath(nodesInShortestPathOrder);
                }, 10 * i);
                return;
            }
            setTimeout(() => {
                const node = visitedNodesInOrder[i];
                document.getElementById(`node-${node.row}-${node.col}`).className =
                    'node node-visited';
            }, 10 * i);
        }
    };

    const animateShortestPath = (nodesInShortestPathOrder) => {
        for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
            setTimeout(() => {
                const node = nodesInShortestPathOrder[i];
                document.getElementById(`node-${node.row}-${node.col}`).className =
                    'node node-shortest-path';
            }, 50 * i);
        }
    };

    return (
        <div className="App">
          <TutorialSlides />
            <AnimatedCursor
                innerSize={8}
                outerSize={8}
                color='193, 11, 111'
                outerAlpha={0.2}
                innerScale={0.7}
                outerScale={5} />
            <div className="ui-btn-container">
                <button onClick={() => visualizeDijkstra()} className="ui-btn">
                    <span>
                        Visualize Dijkstra's Algorithm
                    </span>
                </button>
                <button onClick={() => restartGrid()} className="ui-btn">
                    <span>
                        Restart
                    </span>
                </button>
            </div>
            <div className="grid">
                {grid.map((row, rowIdx) => {
                    return (
                        <div key={rowIdx} className="row">
                            {row.map((node, nodeIdx) => {
                                const { row, col, isStart, isFinish, isWall } = node;
                                const extraClassName = isStart
                                    ? 'node-start'
                                    : isFinish
                                        ? 'node-finish'
                                        : isWall
                                            ? 'node-wall'
                                            : '';
                                return (
                                    <div
                                        key={nodeIdx}
                                        id={`node-${row}-${col}`}
                                        className={`node ${extraClassName}`}
                                        onMouseDown={() => handleMouseDown(row, col)}
                                        onMouseEnter={() => handleMouseEnter(row, col)}
                                        onMouseUp={() => handleMouseUp()}
                                    ></div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const getNewGridWithWallToggled = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
        ...node,
        isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;
    return newGrid;
};

export default App;
