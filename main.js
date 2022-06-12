function setup() {
    // Set-up tree by initializing a root node
    pixelDensity(1)
    createCanvas(1250, 550)
    node_size = 20
    root = new Node(null, 0)
}

function draw() {
    background(0)
    root.show_tree()
}

function mousePressed() {
    // Recursively go down the tree to find out which node was clicked on. 
    // Then add child nodes.
    root.add_child_nodes_by_click(mouseX, mouseY)

    // Recursively go down the tree to update the position of each node
    root.update_pos_of_children()
}