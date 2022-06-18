function update_ancestorial_leaf_nodes(node, ancestorial_leaf_nodes_increase) {
    /**
     * backpropagate up the tree updating the ancestorial_leaf_nodes along the way
     * the ancestorial width is used for printing the nodes, it shows how much space is required 
     * for printing all the nodes for the current node's grandchildren.
     * @param {int} ancestorial_leaf_nodes_increase amount that the ancestorial_leaf_nodes should increase
     */
    leaf_node_depth = node.depth
    while (node) {
        node.ancestorial_leaf_nodes += ancestorial_leaf_nodes_increase
        node = node.parent
    }
}

function update_pos_of_children(node) {
    /**
     * Recursively go down the tree to update the position of each node.
     */

    // If there are no children, return.
    if (node.num_children === 0) {
        return
    }

    // Determine the start location of the most left node.
    // In order to have the tree centered, the starting positon will be set by going half of
    // the ancestorial_leaf_nodes to the left. 
    // (-1 because always 1 node can be place under the parent)
    let start = node.position.x - ((node.ancestorial_leaf_nodes - 1) / 2) * node_size

    for (let i = 0; i < (node.children.length); i++) {
        // Set the position of the child by adding half of it's ancestorial_leaf_nodes to the start
        // position. This way, half of it's ancetorial leaf nodes can be placed to the left, and 
        // half can be placed to the right. (-1 because always 1 node can be place under the 
        // parent)
        node.children[i].position.x = start + (node.children[i].ancestorial_leaf_nodes - 1) / 2 * node_size
        update_pos_of_children(node.children[i])

        if (i < node.children.length - 1) {
            // update the start location by adding the full ancestorial_leaf_nodes.
            start += (node.children[i].ancestorial_leaf_nodes) * node_size
        }
    }
}

function show_tree(node) {
    /**
     * Recursively go down the tree and draw each node.
     */
    node.draw_node()
    for (let i = 0; i < (node.children.length); i++) {
        show_tree(node.children[i])
    }
}

function node_add_color_layer_delayed(node, delay, color) {
    setTimeout(() => {
        node.add_color_layer(color)
    }, delay)
}

function node_remove_color_layer_delayed(node, delay) {
    setTimeout(() => {
        node.remove_color_layer()
    }, delay)
}

function node_unhide_children_delayed(node, delay) {
    setTimeout(() => {
        node.hide_children = false
    }, delay)
}

function update_ancestorial_leaf_nodes_delayed(node, delay, ancestorial_leaf_nodes_increase) {
    setTimeout(() => {
        update_ancestorial_leaf_nodes(node, node.num_children - 1)
        update_pos_of_children(first_root)
    }, delay)
}