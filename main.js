class Solve {
    constructor(grid) {
        this.grid = grid;
    }

    main_solver() {
        let [row, col] = this.next_empty();
        if (row == null) return true;

        for (let i = 1; i <= 9; i++) {
            if (this.is_valid(i, row, col)) {
                this.grid[row][col].value = i;

                if (this.main_solver()) return true;
            }
        }
        this.grid[row][col].value = "";
        return false;
    }

    next_empty() {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (this.grid[row][col].value == "") return [row, col];
            }
        }
        return [null, null];
    }

    is_valid(val, row, col) {
        for (let i = 0; i < 9; i++) {
            if (this.grid[row][i].value == String(val)) return false;
        }
        for (let i = 0; i < 9; i++) {
            if (this.grid[i][col].value == String(val)) return false;
        }

        let row_start = ~~(row / 3) * 3;
        let col_start = ~~(col / 3) * 3;

        for (let i = row_start; i < row_start + 3; i++) {
            for (let j = col_start; j < col_start + 3; j++) {
                if (this.grid[i][j].value == String(val)) return false;
            }
        }

        return true;
    }

    check_invalid_input() {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (this.grid[i][j].value != "") {
                    let temp = this.grid[i][j].value;
                    this.grid[i][j].value = "";
                    let valid = this.is_valid(temp, i, j);
                    this.grid[i][j].value = temp;
                    if (!valid) return valid;
                }
            }
        }
        return true;
    }
}

class UIHandler {
    constructor() {
        this.grid = document.getElementById("grid");
        this.grid_val = new Array(9);
        for (let i = 0; i < 9; i++) this.grid_val[i] = new Array(9);
        this.initialise_grid();
        this.solve_button = document.getElementById("solve");
        this.solve_button.onclick = () => {
            this.solver_started();
        };
        this.clear_button = document.getElementById("clear");
        this.clear_button.onclick = () => {
            this.clear_grid();
        };
    }

    initialise_grid() {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                this.grid_val[i][j] = document.createElement("input");
                this.grid_val[i][j].id = "i" + (i * 10 + j);
                this.grid_val[i][j].setAttribute("type", "number");
                this.grid_val[i][j].addEventListener("change", (event) => {
                    this.check_invalid_entry(event);
                });
                this.grid.appendChild(this.grid_val[i][j]);
            }
        }
    }

    solver_started() {
        this.message(0)
        let solver = new Solve(this.grid_val);
        let valid = solver.check_invalid_input();
        if (valid) {
            let res = solver.main_solver();
            if(!res) {
                this.message(1, 'Unsolvable puzzle')
                this.clear_grid()
            }
        }
        else this.message(1, 'Invalid input');
    }

    clear_grid() {
        for (let i of this.grid_val) for (let j of i) j.value = "";
    }

    check_invalid_entry(event) {
        if (
            parseInt(event.target.value) <= 0 ||
            parseInt(event.target.value) >= 10
        ) {
            event.target.value = "";
        }
    }

    message(cmd, msg=null) {
        let msg_box = document.getElementById('message_box')
        if (cmd == 0) msg_box.style.display = 'none'
        if (cmd == 1) {
            msg_box.innerHTML = msg
            msg_box.style.display = 'block'
        }
    }
}

window.onload = function () {
    new UIHandler();
    controls = document.getElementById('controls')
    controls.style.display = 'block'
};
