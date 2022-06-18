class Node {
    constructor(parent, action) {
        /**
         * Initialize a node
         * @param {Node} parent parent_node.
         * @param {int} action action responsible for transitioning of parent to this node.
         */

        this.parent = parent
        this.children = []
        this.hide_children = true
        this.action = action
        this.num_children = 0
        this.num_grandchildren = 0
        this.num_visits = 0
        this.is_expanded = false
        this.is_terminal = false
        this.num_visits = 0
        this.num_visits_display = 0

        if (this.parent) {
            this.depth = this.parent.depth + 1
        } else {
            this.depth = 0
        }

        // ancestorial_leaf_nodes indicates how wide this node's ancestorial tree is. When printing
        // the tree, each leaf node is placed in a grid where each leaf node will have it's own 
        // unique column, but leaf nodes accross the tree can have shared rows. 
        // ancestorial_leaf_nodes is initialized at 1, since this node itself is responsible for a 
        // wideness of 1. (each new node is a leaf node)
        // Example cases:
        // - If this node has a child, the width doesn't increase, that child can simple be placed
        //   underneath it. (current node is not a leaf node anylonger, but the new child is)
        // - If this node has 2 children, then the width will be 2.
        // - If this node has 2 children, with each a grandchild, the width will be 2 because each
        //   grandchild can be place under each child.
        // - If this node has 2 children, of which 1 has a 2 grandchildren, then the width will be
        //   3, because the child with 2 grandchildren adds a width of 2, and the child with only 1
        //   grandchild adds a width of 1. 2+1=3
        this.ancestorial_leaf_nodes = 1

        // initialize positon of Node. x is by default set to be the middle of the screen. Accurate
        // x positon is calculated using update_pos_of_children().
        // hash is an action trajectory starting from the root node.
        if (this.parent) {
            this.position = createVector(width / 2, this.parent.position.y + node_size * 2)
            this.hash = this.parent.hash + "." + str(this.action)
            this.default_color = [232, 163, 79]
        } else {
            this.position = createVector(width / 2, 50)
            this.hash = "r"
            this.default_color = [255, 0, 0]
        }
        this.color = [this.default_color]
    }

    add_color_layer(color) {
        this.color.push(color)

        this.num_visits_display = this.num_visits
    }

    remove_color_layer() {
        this.color.pop()

    }

    add_child(action) {
        /**
         * add a child to this node
         * @param {int} action transition action for obtaining this child
         */
        let child = new Node(this, action)
        this.children.push(child)
        this.num_children += 1
        if (this.parent) {
            this.parent.num_grandchildren += 1
        }
    }

    draw_node() {
        /**
         * draw node and connecting lines to it's children.
         */
        if (this.parent && this.parent.hide_children) {
            return
        }
        var x_to_circle_border
        var y_to_circle_border
        
        // print elipse for the node
        fill(this.color[this.color.length - 1])
        stroke(this.color[this.color.length - 1])
        ellipse(this.position.x, this.position.y, node_size, node_size)

        // print the num_visits inside the node
        fill(0, 0, 0)
        text(str(this.num_visits_display), this.position.x, this.position.y);

        // draw a line from the edge of this node's ellipse to the edge of teh parent's node elipse
        stroke(this.color[this.color.length - 1])
        if (this.parent) {
            if (this.position.x === this.parent.position.x) {
                x_to_circle_border = 0
                y_to_circle_border = node_size / 2
            } else {
                // find angle of angle between this node and parent node
                let theta = Math.atan(Math.abs((this.position.y - this.parent.position.y) / (this.parent.position.x - this.position.x)))
                
                // find x and y axis of the cross-section of 
                // - the line from the center of this node's ellipse to the center of the parent's ellipse
                // - the circumference of this node's ellipse
                x_to_circle_border = node_size / 2 * Math.cos(theta)
                y_to_circle_border = x_to_circle_border * Math.tan(theta)

                x_to_circle_border = x_to_circle_border * (this.position.x - this.parent.position.x) / Math.abs((this.position.x - this.parent.position.x))
            }

            // draw line
            line(this.position.x - x_to_circle_border, this.position.y - y_to_circle_border, this.parent.position.x + x_to_circle_border, this.parent.position.y + y_to_circle_border)
        }
    }

    expand_children() {
        /**
         * add children to the current node
         */

        // let children_prev = this.num_children

        // randomly add children
        let children_added = 2 //int(random(2)) + 1
        for (let i = 0; i < children_added; i++) {
            this.add_child(this.num_children + 1)
        }
    }

}
