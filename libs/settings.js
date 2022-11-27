class SettingsMenu{
    // settings that allows user to change hyperparameters of MCTS
    constructor(){
        this.settings_menu = []
        this.texts = []
        this.hidden = false
        this.settings_row_size = 30
        this.pos_x_input = width/2-42
        this.pos_x_text = width/2-170//12
        let pos_y = 62

        // create input box
        this.texts.push("Random Seed")
        let inputSeed = createInput(random_seed, 'number');
        inputSeed.input(seedInput);
        inputSeed.position(this.pos_x_input, pos_y)
        this.settings_menu.push(inputSeed)
        
        // create input box
        this.texts.push("Tree Depth")
        pos_y += this.settings_row_size
        let inputDepth = createInput(conf.max_tree_depth, 'number');
        inputDepth.input(treeInput);
        inputDepth.position(this.pos_x_input, pos_y)
        this.settings_menu.push(inputDepth)
        inputDepth.elt.min = 1

        // create input box
        this.texts.push("Max Iterations")
        pos_y += this.settings_row_size
        let inputIt = createInput(conf.max_iterations, 'number');
        inputIt.input(iterationInput);
        inputIt.position(this.pos_x_input, pos_y)
        this.settings_menu.push(inputIt)
        
        // create input box
        this.texts.push("Gamma")
        pos_y += this.settings_row_size
        let inputGamma = createInput(conf.gamma, 'number');
        inputGamma.input(gammaInput);
        inputGamma.position(this.pos_x_input, pos_y)
        this.settings_menu.push(inputGamma)
        
        // create input box
        this.texts.push("Expl. Constant")
        pos_y += this.settings_row_size
        let inputExpConst = createInput(conf.exploration_constant, 'number');
        inputExpConst.input(expConstInput);
        inputExpConst.position(this.pos_x_input, pos_y)
        this.settings_menu.push(inputExpConst)

        // create input box
        this.texts.push("Max children")
        pos_y += this.settings_row_size
        let inputMaxChildren = createInput(conf.max_children, 'number');
        inputMaxChildren.input(maxChildrenInput);
        inputMaxChildren.position(this.pos_x_input, pos_y)
        this.settings_menu.push(inputMaxChildren)

        // create input box
        this.texts.push("Random children")
        pos_y += this.settings_row_size
        var inputRandomizeChildren
        inputRandomizeChildren = createCheckbox(conf.randomize_children, false);
        inputRandomizeChildren.changed(randomizeChildrenInput);
        inputRandomizeChildren.position(this.pos_x_input, pos_y)
        this.settings_menu.push(inputRandomizeChildren)
    }

    hide(){
        for (let i = 0; i < this.settings_menu.length; i++) {
            this.settings_menu[i].hide()
        }
        this.hidden = true
    }

    show(){
        for (let i = 0; i < this.settings_menu.length; i++) {
            this.settings_menu[i].show()
        }
        this.hidden = false
    }

    print_text() {
        let pos_y = 68
        fill(255, 255, 255) // black filling
        stroke(255, 255, 255) // black stroke
        strokeWeight(0) // thickness of text
        textSize(14) // size of text
        for (let i = 0; i < this.texts.length; i++) {
            text(this.texts[i], this.pos_x_text, pos_y)
            pos_y += this.settings_row_size
        }
    }

}

function seedInput() {
    // get the value entered
    random_seed = this.value()
    reset_tree()
}
function treeInput() {
    // get the value entered
    conf.max_tree_depth = parseInt(this.value())
    reset_tree()
}
function iterationInput() {
    // get the value entered
    conf.max_iterations = parseInt(this.value())
    reset_tree()
}
function gammaInput() {
    // get the value entered
    conf.gamma = parseFloat(this.value())
    reset_tree()
}
function expConstInput() {
    // get the value entered
    conf.exploration_constant = parseFloat(this.value())
    reset_tree()
}
function maxChildrenInput() {
    // get the value entered
    conf.max_children = parseFloat(this.value())
    reset_tree()
}

function randomizeChildrenInput() {
    // get the value entered
    if (conf.randomize_children === false) {
        conf.randomize_children = true
    } else {
        conf.randomize_children = false
    }
    reset_tree()
}