const GRID_SIZE = 4
const CELL_SIZE = 20
const CELL_GAP = 2

export default class Grid {
    #cells //private variable: only accessed/declared inside Grid class; only able to access individual elements inside cells, instead of all the cells at once. can't overwrite all cells in grid from outside Grid class

    constructor(gridElement) {
        gridElement.style.setProperty("--grid-size", GRID_SIZE)
        gridElement.style.setProperty("--cell-size", `${CELL_SIZE}vmin`) 
        gridElement.style.setProperty("--cell-gap", `${CELL_GAP}vmin`)
        this.#cells = createCellElements(gridElement).map((cellElement, index) => {
            return new Cell(
                cellElement, 
                index % GRID_SIZE, 
                Math.floor(index / GRID_SIZE)
                )
        })
    }

    get cells() {
        return this.#cells
    }

    get cellsByColumn() {
        return this.#cells.reduce((cellGrid, cell) => {
            cellGrid[cell.x] = cellGrid[cell.x] || []
            cellGrid[cell.x][cell.y] = cell
            return cellGrid
        }, [])
    }

    get cellsByRow() {
        return this.#cells.reduce((cellGrid, cell) => {
            cellGrid[cell.y] = cellGrid[cell.y] || []
            cellGrid[cell.y][cell.x] = cell
            return cellGrid
        }, [])
    }

    get #emptyCells() {
        return this.#cells.filter(cell => cell.tile == null)
    }

    randomEmptyCell() {
        const randomIndex = Math.floor(Math.random() * this.#emptyCells.length) //value between 0 and index
        return this.#emptyCells[randomIndex]
}
}

    

class Cell {
    #cellElement    //so can't modify these outside the Cell class
    #x
    #y
    #tile
    #mergeTile

    constructor(cellElement, x, y) {
        this.#cellElement = cellElement
        this.#x = x;
        this.#y = y;
    }

    get x() {
        return this.#x
    }

    get y() {
        return this.#y
    }

    get tile() {
        return this.#tile
    }

    set tile(value) {
        this.#tile = value
        if (value == null) return
        this.#tile.x = this.#x  //setting new position after move
        this.#tile.y = this.#y
    }

    get mergeTile(){
        return this.#mergeTile
    }

    set mergeTile(value) {
        this.#mergeTile = value
        if (value == null) return
        this.#mergeTile.x = this.#x
        this.#mergeTile.y = this.#y
    }

    canAccept(tile) {
        return (
            this.tile == null || 
            (this.mergeTile == null && this.tile.value == tile.value)
        )
    }

    mergeTiles() {
        if(this.tile == null || this.mergeTile == null) return
        this.tile.value = this.tile.value + this.mergeTile.value
        this.mergeTile.remove()
        this.mergeTile = null
    }
}

function createCellElements(gridElement) {  //create the number of elements (div "cells") needed to fill grid, depending on size of grid GRID_SIZE
    const cells = []    //create empty array
    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++)  {   //grid size squared is amount of cells: one loop through for loop through it to create each one of the cells
        const cell = document.createElement("div")
        cell.classList.add("cell")
        cells.push(cell)    //adding to array
        gridElement.append(cell)    //adding element to page
    }
    return cells
}