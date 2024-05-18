# imcts

Welcome to [imcts](https://whakamua.github.io/imcts/)! An interactive implementation of MCTS.
The buttons in the top allow you to click through the selection, expansion and
backpropagation steps.

## Selection step
The selection step will choose the next node by taking the child node with the largest PUCT value, the PUCT value is calculated in the following way:

$PUCT(s,a) = Q(s, a) + U(s,a)$<br>
$U(s,a) = c * P(s,a) * \frac{\sqrt{N_s}}{(N_{s'}+1)}$<br>
$Q(s,a) = r(s,a) + V(s')$<br>
where:
- $c$ is the exploration constant.
- $P(s,a)$ is the prior corresponding to taking action a in state s.
- $N$ is the number of visits of the node in state s.
- $N_{s'}$ is the number of visits of the child node corresponding to taking action a in state s.
- $Q(s,a)$ is the state action value corresponding to taking the action a in state s.
- $r(s,a)$ is the reward obtained from taking action a in state s.
- $V(s')$ is the value of the state s', which is reached by taking action a in state s.

In the visualized tree, PUCT(s,a), Q(s,a), P(s,a) and r(s,a) are always displayed in the child node that is reached by taking action a in state s.

## Expansion step
When a node is not expanded yet, meaning, it has no children, and it is not at the maximum tree depth, it is expanded. Upon expanding, it's children are generated and its prior policy and value are predicted:

### Node Evaluation
The Prior and Value are often estimated using a Neural Network, in this case, the Prior is always predicted to be uniform and the Value is predicted to be the average Value of a node. This can be done because the reward is sampled from a random distribution with mean $r_{mean}$. Therefore, the value is precited as $r_{mean} \cdot \frac{1}{1-\gamma}$, where $\gamma$ is the discount factor.

## Backpropagation step
The backpropagation step will backpropagate the information up in the tree. It uses the Bellman equation to update the value V and number of visits of each of its ancenstors like so:<br>
$s' := leaf\_node$

$V_{update}(s) = r(s,a) + \gamma * V_{update}(s')$

$N(s) = N(s) + 1$

$V(s) = \frac{V(s) * (N(s) - 1) + V_{update}(s)}{N(s)}$

$s' = s$

## Iterations
Every sequence of selection, node expansion, node evaluation and backpropagation is called an iteration. You can click the iteration button to fast forward it.

## MCTS Search
An MCTS search consists of a number of Iterations. After a search the child node with the most visits ($N$) is chosen as the new root node. Now color coded in red. You can click the search button to fast forward is.

## Info displayed
You'll see that each node displays some information, this is what they represent:

- N: the number of visits of this node.
- U: U(s,a) where s is the state of the parent node and a is the action leading to this node.
- Q: Q(s,a) where s is the state of the parent node and a is the action leading to this node.
- r: r(s,a) where s is the state of the parent node and a is the action leading to this node.
- R: the sum of rewards up until this node.
- PUCT: PUCT(s,a) where s is the state of the parent node and a is the action leading to this node

## Settings
In the top left corner you see some settings displayed. Here is what they do:
- Random Seed: The simulation has been made deterministic, so that you can run the same experiment multiple times. You can change the experiment by changing the random seed.
- Tree depth: The maximum depth of the tree.
- Max Iterations: Number of iterations that are done within a single search
- Gamma: Discount factor $\gamma$ used in the Bellman equation.
- Expl. Constant: Exploration constant $c$ used by the PUCT formula.
- Max chilren: Maximum number of children a node can get.
- Randomize Children: Whether to always let a node have the max number of children or to take a random amount between 1 and max children.
