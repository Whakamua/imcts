function add_child(node, action) {
    /**
     * add a child to this node
     * @param {int} action transition action for obtaining this child
     */
    let child = new Node(node, action)
    node.children.push(child)
    node.num_children += 1
}

function expand_children(node) {
    // add children to the current node

    // randomly add children
    let children_added = 2 //int(random(2)) + 1
    let num_current_children = node.num_children
    for (let i = 0; i < children_added; i++) {
        add_child(node, num_current_children + i)
    }
    node.is_expanded = true
}

function get_PUCB(node) {
    var P = 0

    if (node.parent){
        P = exploration_constant * node.parent.policy[node.action] * node.parent.num_visits ** 0.5 / (1 + node.num_visits)
    } else {
        P = 0
    }
    return node.value + P
}

function get_best_child(node) {
    // find the best child based on heuristics

    // let support = [...Array(node.num_children).keys()]
    // let prob_dist = Array(node.num_children)
    // for (let i = 0; i < prob_dist.length; i++) {
    //     prob_dist[i] = 1 / prob_dist.length
    // }

    // // let action = weightedChoice(support, prob_dist)
    // let action = null
    // if (node.depth % 2 === 0) {
    //     action = weightedChoice([0, 1], [0.75, 0.25])
    // } else {
    //     action = weightedChoice([0, 1], [0.25, 0.75])
    // }

    var children_PUCB = []; children_PUCB.length = node.num_children

    for (let i = 0; i < node.num_children; i++) {

        let PUCB = get_PUCB(node.children[i])
        node.children[i].PUCB = PUCB
        children_PUCB[i] = PUCB
    }

    action = indexOfMax(children_PUCB)

    best_child = node.children[action]
    return best_child
}

function get_most_visited_node(node) {
    // get the child node that has the most number of visits

    let most_visits = -1
    let best_children = []
    for (let i = 0; i < node.num_children; i++) {
        if (node.children[i].num_visits > most_visits) {
            best_children = [node.children[i]]
        } else if (node.children[i].num_visits === most_visits) {
            best_children.push(node.children[i])
        }
        most_visits = node.children[i].num_visits
    }
    best_child_idx = int(random(best_children.length))
    return best_children[best_child_idx]
}

function step_backpropagate(node) {
    // do a single backpropagation step
    if (node === root) {
        return node
    } else {
        let new_value = node.reward + gamma * node.value
        node.parent.value = ((node.parent.value * node.parent.num_visits) + new_value) / (node.parent.num_visits + 1)
        node.parent.num_visits += 1
        node = node.parent
        return node
    }
}

function next_root(current_root) {
    // find the most visited child of the current root and set it to be the new root.
    root = get_most_visited_node(current_root)

    // update it's color
    root.default_color = root.parent.default_color
    root.color[0] = root.parent.default_color

    // set the current_node to be the new root
    current_node = root
    iteration_number = 0
}

function next_root_delayed(root, delay) {
    setTimeout(() => {
        next_root(root)
    }, delay)
}

function get_policy_and_value(node) {
    let policy = []; policy.length = node.num_children
    let sum_policy = 0
    for (let i = 0; i < node.num_children; i++) {
        policy[i] = 1 // random(1) / node.num_children
        sum_policy += policy[i]
    }
    for (let i = 0; i < node.num_children; i++) [
        policy[i] /= sum_policy
    ]
    var value
    if (node.depth === max_tree_depth){
        value = node.reward // node.reward * 1 / (1 - gamma)
    } else{
        value = 0
    }
    return [policy, value]
}
