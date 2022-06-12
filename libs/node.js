class Node {
    constructor(parent, action) {
        /**
         * Initialize a node
         * @param {Node} parent parent_node.
         * @param {int} action action responsible for transitioning of parent to this node.
         */

        this.parent = parent
        this.children = []
        this.action = action
        this.num_children = 0

        // ancestorial_width indicates how wide this node's ancestorial tree is. Initialized at 1,
        // since this node itself is responsible for a wideness of 1.
        // Example cases:
        // - If this node has a child, the width doesn't increase, that child can simple be placed
        //   underneath it.
        // - If this node has 2 children, then the width will be 2.
        // - If this node has 2 children, with each a grandchild, the width will be 2 because each
        //   grandchild can be place under each child.
        // - If this node has 2 children, of which 1 has a 2 grandchildren, then the width will be
        //   3, because the child with 2 grandchildren adds a width of 2, and the child with only 1
        //   grandchild adds a width of 1. 2+1=3
        this.ancestorial_width = 1

        // initialize positon of Node. x is by default set to be the middle of the screen. Accurate
        // x positon is calculated using update_pos_of_children().
        // hash is an action trajectory starting from the root node.
        if (this.parent) {
            this.position = createVector(width / 2, this.parent.position.y + node_size * 2)
            this.hash = this.parent.hash + "." + str(this.action)
        } else {
            this.position = createVector(width / 2, node_size)
            this.hash = "r"
        }
    }

    add_child(action) {
        /**
         * add a child to this node
         * @param {int} action transition action for obtaining this child
         */
        let child = new Node(this, action)
        this.children.push(child)
        this.num_children += 1
    }

    draw_node() {
        /**
         * draw node and connecting lines to it's children.
         */
        fill(232, 163, 79)
        ellipse(this.position.x, this.position.y, node_size, node_size)
        for (let i = 0; i < (this.children.length); i++) {
            stroke(232, 163, 79)
            line(this.position.x, this.position.y, this.children[i].position.x, this.children[i].position.y)
        }
    }

    show_tree() {
        /**
         * Recursively go down the tree and draw each node.
         */
        this.draw_node()
        for (let i = 0; i < (this.children.length); i++) {
            this.children[i].show_tree()
        }
    }

    backpropagate(ancestorial_width_increase) {
        /**
         * backpropagate up the tree updating the ancestorial_width along the way
         * @param {int} ancestorial_width_increase amount that the ancestorial_width should increase
         */
        this.ancestorial_width += ancestorial_width_increase
        if (this.parent) {
            this.parent.backpropagate(ancestorial_width_increase)
        }
    }

    expand_children() {
        /**
         * add children to the current node
         */

        let children_prev = this.num_children

        // reandomly add children
        let children_added = int(random(5)) + 2
        for (let i = 0; i < children_added; i++) {
            this.add_child(this.num_children + 1)
        }

        // if previously there was no child, then the first child added does not contribute to the 
        // ancestorial_width_increase, because it can simply be placed underneath its parent. 
        if (children_prev === 0) {
            this.backpropagate(children_added - 1)
        } else {
            this.backpropagate(children_added)
        }
    }

    add_child_nodes_by_click(mx, my) {
        /**
         * Recursively go down the tree to find out which node was clicked on. 
         * Then add child nodes.
         */
        let d = dist(this.position.x, this.position.y, mx, my)
        if (d <= node_size / 2) {
            this.expand_children()
            return
        }
        for (let i = 0; i < (this.children.length); i++) {
            this.children[i].add_child_nodes_by_click(mx, my)
        }
    }

    update_pos_of_children() {
        /**
         * Recursively go down the tree to update the position of each node.
         */

        // If there are no children, return.
        if (this.num_children === 0) {
            return
        }

        // Determine the start location of the most left node.
        // In order to have the tree centered, the starting positon will be set by going half of
        // the ancestorial_width to the left. 
        // (-1 because always 1 node can be place under the parent)
        let start = this.position.x - ((this.ancestorial_width - 1) / 2) * node_size

        for (let i = 0; i < (this.children.length); i++) {
            // Set the position of the child by adding half of it's ancestorial_width to the start
            // position. This way, half of it's ancetorial leaf nodes can be placed to the left, and 
            // half can be placed to the right. (-1 because always 1 node can be place under the 
            // parent)
            this.children[i].position.x = start + (this.children[i].ancestorial_width-1)/2 * node_size
            this.children[i].update_pos_of_children()

            if (i < this.children.length - 1) {
                // update the start location by adding the full ancestorial_width.
                start += (this.children[i].ancestorial_width) * node_size
            }
        }
    }
}
