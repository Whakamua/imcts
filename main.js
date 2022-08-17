function setup() {

    pixelDensity(2)
    createCanvas(2000, 1250)

    // Initialize some global variables
    testing = false
    step_delay = 50
    // diameter of the node on display
    node_size = 60

    // discount factor
    gamma = 0.8

    mega_reward_available = true

    max_tree_depth = 5

    exploration_constant = 2

    // whether the next step show be backprop, or selection
    step_state = "selection" // choice = "selection" or "backprop"

    // number of iterations per search
    max_iterations = 2000

    // current iteration number
    iteration_number = 0

    reward_mean = 0
    reward_std = 0.2

    // Set-up tree by initializing a root node
    max_return = 0
    second_max_return = 0
    first_root = new Node(null, 0)
    root = first_root
    current_node = root
    current_value = 0

    // buttons:
    finish_search_button = createButton('finish_search')
    finish_search_button.position(width / 2 - 103, 0)
    finish_search_button.mousePressed(do_finish_search_button)

    finish_iteration_button = createButton('finish_iteration')
    finish_iteration_button.position(width / 2, 0)
    finish_iteration_button.mousePressed(do_finish_iteration_button)

    step_selection_button = createButton('selection')
    step_selection_button.position(width / 2 + 103, 0)
    step_selection_button.mousePressed(do_step_selection_button)

    step_backprop_button = createButton(' backprop ')
    step_backprop_button.position(width / 2 + 103, 0)
    step_backprop_button.mousePressed(do_step_backprop_button)

    // test()

}

function test() {
    noLoop()
    testing = true
    test_runs = 100
    step_delay = 0

    pass = 0
    fail = 0
    avg_diff_fail = 0
    avg_diff_pass = 0
    for (let i = 0; i < test_runs; i++) {
        print("testing")
        max_return = 0
        iteration_number = 0
        first_root = new Node(null, 0)
        root = first_root
        current_node = root
        current_value = 0
        mega_reward_available = true
        for (let i = 0; i < max_tree_depth; i++) {
            finish_search()
        }
        if (root.return === max_return) {
            pass++
            avg_diff_pass = avg_diff_pass + 1 / pass * (abs(second_max_return - max_return) - avg_diff_pass)
        } else {
            fail++
            avg_diff_fail = avg_diff_fail + 1 / fail * (abs(second_max_return - max_return) - avg_diff_fail)
            // break
        }
    }
    print("pass %: " + str(pass / (pass + fail)))
    print("avg diff of failures: " + str(avg_diff_fail))
    print("avg diff of passes: " + str(avg_diff_pass))
    update_pos_of_children(first_root)
    testing = false
    loop()
    a = 1
}

function do_finish_search_button() {
    if (root.depth === max_tree_depth) {
        return
    }
    // finish the search by running the remainder iterations
    finish_search()
}

function finish_search() {
    // finish the search by running the remainder iterations
    num_it_left = max_iterations - iteration_number
    for (let i = 0; i < num_it_left; i++) {
        finish_iteration()
    }
}

function do_step_selection_button(delay = 0) {
    if (root.depth === max_tree_depth) {
        return
    }
    // do a single step of selection
    current_node = do_step_selection(current_node)

    // highlight the newly selected node to indicate that it got selected.
    if (step_state === "selection") {
        current_node.add_color_layer([255, 255, 255])
    }

    // If the step_state turned to backprop, that means a node expansion occured. Therefore, 
    // the new children are unhidden and the trajectory's ancestorial width is updated.
    if (step_state === "backprop") {
        current_node.num_visits += 1
        current_node.hide_children = false
        if (current_node.depth < max_tree_depth) {
            update_ancestorial_leaf_nodes(current_node, current_node.num_children - 1)
        }
    }
}

function do_step_selection(node) {
    if (node.depth === max_tree_depth) {
        step_state = "backprop"
        let policy_value = get_policy_and_value(node)
        node.policy = policy_value[0]
        node.value = policy_value[1]
        current_value = policy_value[1]
        return node
    }
    // if the current node is not expanded, expand it and switch the step_state to backprop
    if (!node.is_expanded) {
        expand_children(node)
        let policy_value = get_policy_and_value(node)
        node.policy = policy_value[0]
        node.value = policy_value[1]
        current_value = policy_value[1]
        step_state = "backprop"
        return node
        // else get the next best child
    } else {
        node = get_best_child(node)
        return node
    }
}

function do_step_backprop_button() {
    if (root.depth === max_tree_depth) {
        return
    }
    // remove the highlight that got added during the selection step
    if (current_node !== root) {
        current_node.remove_color_layer()
    }

    // do a backpropagation step, the node returned is the parent of the node given
    current_node = do_step_backpropagate(current_node)

    // whenever enough iterations have been completed, find the next root node.
    if (iteration_number === max_iterations) {
        next_root(root)
    }
}

function do_step_backpropagate(node) {
    // perform a backpropagation step
    node_value = step_backpropagate(node, current_value)
    node = node_value[0]
    current_value = node_value[1]
    // when the root node got reached, change to selection mode and increment the iteration number
    if (node === root) {
        step_state = "selection"
        iteration_number += 1
    }
    return node
}

function do_finish_iteration_button() {
    if (root.depth === max_tree_depth) {
        return
    }
    // If all the max iterations has been reached. Make sure that no more iterations can be done,
    // when the button is pressed.
    if (iteration_number >= max_iterations) {
        return
    }
    finish_iteration()
}

function finish_iteration() {
    // Finish the iteration by running the remaining selection and backpropagation steps

    // To make the animation of highlighting nodes not all instant. A delay is added between each
    // highlight that is displayed. The next variables keep track of that.
    delay = 0
    delay_delta = 50
    selection_to_backprop_pause = 250

    // while still in the selection state:
    if (step_state === "selection") {
        while (true) {
            // select the best node and highlight it after a delay
            current_node = do_step_selection(current_node)
            delay += delay_delta
            if (step_state === "selection" && testing === false) {
                node_add_color_layer_delayed(current_node, delay, [255, 255, 255])
            }
            // If the step_state turned to backprop, that means a node expansion occured. Therefore, 
            // the new children are unhidden and the trajectory's ancestorial width is updated.
            if (step_state === "backprop") {
                current_node.num_visits += 1
                // unhide the children and update the ancestorial width after a delay
                if (testing === false) {
                    node_unhide_children_delayed(current_node, delay + selection_to_backprop_pause / 2)
                } else {
                    current_node.hide_children = false
                }
                if (current_node.depth < max_tree_depth) {
                    if (testing === false) {
                        update_ancestorial_leaf_nodes_delayed(current_node, delay + selection_to_backprop_pause / 2)
                    } else {
                        update_ancestorial_leaf_nodes(current_node, current_node.num_children - 1)
                    }
                }
                break
            }
        }
    }



    delay += selection_to_backprop_pause

    // while in the backprop state
    while (step_state === "backprop") {

        // remove the highlight that got added during the selection step
        if (current_node !== root && testing === false) {
            node_remove_color_layer_delayed(current_node, delay)
        }
        // do a backpropagation step, the node returned is the parent of the node given
        current_node = do_step_backpropagate(current_node)
        delay += delay_delta
        // whenever enough iterations have been completed, find the next root node. Do this after a 
        // delay so that it only gets animated after the previous animations are done
        if (iteration_number === max_iterations) {
            if (testing === false) {
                next_root_delayed(root, delay)
            } else {
                next_root(root)
            }
            break
        }
    }

}

function draw() {
    // make sure the right button is displayed according to the step_state
    if (step_state === "selection") {
        step_backprop_button.hide()
        step_selection_button.show()
    } else if (step_state === "backprop") {
        step_selection_button.hide()
        step_backprop_button.show()
    }

    // show the tree on the screen
    background(0)
    show_tree(first_root)
}

function mousePressed() {
    // Recursively go down the tree to update the position of each node
    update_pos_of_children(first_root)
}