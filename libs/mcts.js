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
    let children_added = int(random(3)) + 1
    let num_current_children = node.num_children
    for (let i = 0; i < children_added; i++) {
        add_child(node, num_current_children + i)
    }
    node.is_expanded = true
}

function get_U(node) {
    if (node.parent) {
        return exploration_constant * node.parent.policy[node.action] * node.parent.num_visits ** 0.5 / (1 + node.num_visits)
    } else {
        return 0
    }
}

function get_Q(node) {
    if (node.num_visits > 0) {
        return gamma * node.value + node.reward
    } else {
        return 0
    }
}

function get_PUCT(node) {
    return get_Q(node) + get_U(node)
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

    var children_PUCT = []; children_PUCT.length = node.num_children

    for (let i = 0; i < node.num_children; i++) {

        let PUCT = get_PUCT(node.children[i])
        node.children[i].PUCT = PUCT
        children_PUCT[i] = PUCT
    }

    action = indexOfMax(children_PUCT)

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

function step_backpropagate(node, value) {
    // do a single backpropagation step
    if (node === root) {
        return [node, value]
    } else {
        if (node.parent.max_value < node.max_value + node.reward) {
            node.parent.max_value = node.max_value + node.reward
        }
        let new_value = node.reward + gamma * value
        node.parent.value = ((node.parent.value * node.parent.num_visits) + new_value) / (node.parent.num_visits + 1)
        node.parent.num_visits += 1
        node = node.parent
        return [node, new_value]
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
        policy[i] = 0.2 + random(0.8)
        sum_policy += policy[i]
    }
    for (let i = 0; i < node.num_children; i++) [
        policy[i] /= sum_policy
    ]
    var value
    // if (node.depth === max_tree_depth){
    //     value = node.reward // node.reward * 1 / (1 - gamma)
    // } else{
    //     value = 0
    // }
    value = reward_mean * 1 / (1 - gamma)
    return [policy, value]
}
