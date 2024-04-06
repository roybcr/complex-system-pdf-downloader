const axios = require('axios');
const fs = require('fs');
const path = require('path');
const {promisify} = require('util');
const mkdir = promisify(fs.mkdir);

/*********************************************************************************************************/
const issues = document.querySelectorAll('.issuex4>a');
const volumes_ = new Map();

issues.forEach((issue) => {
    const title = issue.attributes.title.value;
    const image = issue.firstElementChild.currentSrc;
    const url = issue.attributes.href.baseURI.concat(issue.attributes.href.value.slice(1)).replace('/archives', '');
    const vol = title.split(',')[0];
    if (!volumes_.has(vol)) volumes_.set(vol, [{title, image, url}]);
    else volumes_.get(vol).push({title, image, url});
});

async function* makeTextFileLineIterator(fileURL) {
    const utf8Decoder = new TextDecoder('utf-8');
    const response = await fetch(fileURL);
    const reader = response.body.getReader();
    let {value: chunk, done: readerDone} = await reader.read();
    chunk = chunk ? utf8Decoder.decode(chunk) : '';

    const newline = /\r?\n/gm;
    let startIndex = 0;
    let result;

    while (true) {
        const result = newline.exec(chunk);
        if (!result) {
            if (readerDone) break;
            const remainder = chunk.substr(startIndex);
            ({value: chunk, done: readerDone} = await reader.read());
            chunk = remainder + (chunk ? utf8Decoder.decode(chunk) : '');
            startIndex = newline.lastIndex = 0;
            continue;
        }
        yield chunk.substring(startIndex, result.index);
        startIndex = newline.lastIndex;
    }

    if (startIndex < chunk.length) {
        // Last line didn't end in a newline char
        yield chunk.substr(startIndex);
    }
}

let on = false;
let no = 2;

function processLine(text, articles) {
    console.log(typeof text);
    if (/<h3 class="absTitle">/.test(text)) {
        on = true;
        no = 2;
    } else if (on && no-- > 0) {
        if (no === 1) {
            articles.push({name: text.match(/>.+</)[0].slice(1, -1)});
        } else {
            articles[articles.length - 1].pdf = text.match(/https\:\/\/.*\.pdf/)[0];
            on = false;
        }
    }
}

async function run(url, articles) {
    for await (const line of makeTextFileLineIterator(url)) {
        processLine(line, articles);
    }
}

async function parse() {
    for (const batch of volumes_.values()) {
        for (const issue of batch) {
            const articles = [];
            await run(issue.url, articles);
            Object.assign(issue, {stories: articles});
            console.log(issue);
        }
    }
}

parse();
/*********************************************************************************************************/

const volumes = new Map([
    [
        'Vol. 32',
        [
            {
                title: 'Vol. 32, No. 1',
                image: 'https://content.wolfram.com/sites/13/2023/06/JCS32-1-outside-front.png',
                url: 'https://www.complex-systems.com/issues/32-1/',
                stories: [
                    {
                        name: 'Cultivating the Garden of Eden',
                        pdf: 'https://content.wolfram.com/sites/13/2023/06/32-1-1.pdf',
                    },
                    {
                        name: 'The Domino Problem of the Hyperbolic Plane Is Undecidable: New Proof',
                        pdf: 'https://content.wolfram.com/sites/13/2023/06/32-1-2.pdf',
                    },
                    {
                        name: 'A Game of Life Shifted toward a Critical Point',
                        pdf: 'https://content.wolfram.com/sites/13/2023/06/32-1-3.pdf',
                    },
                    {
                        name: 'Spatial Scale Effects in COVID-19 Spread Models',
                        pdf: 'https://content.wolfram.com/sites/13/2023/06/32-1-4.pdf',
                    },
                    {
                        name: 'Use of Recurrence Plots to Find Mutations in Deoxyribonucleic Acid Sequences',
                        pdf: 'https://content.wolfram.com/sites/13/2023/06/32-1-5.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 32, No. 2',
                image: 'https://content.wolfram.com/sites/13/2023/10/JCS32-2-outside-front.png',
                url: 'https://www.complex-systems.com/issues/32-2/',
                stories: [
                    {
                        name: 'Special Issue: Selected Papers from the First Asian Symposium on Cellular Automata Technology, 2022 (ASCAT 2022)',
                        pdf: 'https://content.wolfram.com/sites/13/2023/10/32-2-1.pdf',
                    },
                    {
                        name: 'A Cellular Automaton\u2013Based Technique for Estimating Mineral Resources',
                        pdf: 'https://content.wolfram.com/sites/13/2023/10/32-2-2.pdf',
                    },
                    {
                        name: 'One-Dimensional Cellular Automaton Transitions and Integral Value Transformations Representing Deoxyribonucleic Acid Sequence Evolutions',
                        pdf: 'https://content.wolfram.com/sites/13/2023/10/32-2-3.pdf',
                    },
                    {
                        name: 'Cellular Automaton\u2013Based Emulation of the Mersenne Twister',
                        pdf: 'https://content.wolfram.com/sites/13/2023/10/32-2-4.pdf',
                    },
                    {
                        name: 'Hash Function Design Based on Hybrid Five-Neighborhood Cellular Automata and Sponge Functions',
                        pdf: 'https://content.wolfram.com/sites/13/2023/10/32-2-5.pdf',
                    },
                    {
                        name: 'Analyzing and Extending Cellular Automaton Simulations of Dynamic Recrystallization',
                        pdf: 'https://content.wolfram.com/sites/13/2023/10/32-2-6.pdf',
                    },
                    {
                        name: 'Evaluating Community Detection Algorithms for Multilayer Networks: Effectiveness of Link Weights and Link Direction',
                        pdf: 'https://content.wolfram.com/sites/13/2023/10/32-2-7.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 32, No. 3',
                image: 'https://content.wolfram.com/sites/13/2024/01/JCS32-3-out-front.png',
                url: 'https://www.complex-systems.com/issues/32-3/',
                stories: [
                    {
                        name: 'Classification of Elementary Cellular Automata Based on Their Limit Cycle Lengths in Z|k',
                        pdf: 'https://content.wolfram.com/sites/13/2024/01/32-3-1.pdf',
                    },
                    {
                        name: 'Turing Patterns in Networks',
                        pdf: 'https://content.wolfram.com/sites/13/2024/01/32-3-2.pdf',
                    },
                    {
                        name: 'Affinity Classification Problem by Stochastic Cellular Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2024/01/32-3-3.pdf',
                    },
                    {
                        name: 'Evolving Multi-valued Regulatory Networks on Tunable Fitness Landscapes',
                        pdf: 'https://content.wolfram.com/sites/13/2024/01/32-3-4.pdf',
                    },
                    {
                        name: 'Investigating Rules and Parameters of Reservoir Computing with Elementary Cellular Automata, with a Criticism of Rule 90 and the Five-Bit Memory Benchmark',
                        pdf: 'https://content.wolfram.com/sites/13/2024/02/32-3-5.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 32, No. 4',
                image: 'https://content.wolfram.com/sites/13/2024/03/JCS32-4-outside-front-2.png',
                url: 'https://www.complex-systems.com/issues/32-4/',
                stories: [
                    {
                        name: 'System Metamodeling of Open-Ended Evolution  Implemented with Self-Modifying Code',
                        pdf: 'https://content.wolfram.com/sites/13/2024/03/32-4-1.pdf',
                    },
                    {
                        name: 'An Alternative Representation of Turing Machines by Means of the Iota-Delta Function',
                        pdf: 'https://content.wolfram.com/sites/13/2024/03/32-4-2.pdf',
                    },
                    {
                        name: 'Formal Grammars Generating Fractal Descriptions of Molecular Structures',
                        pdf: 'https://content.wolfram.com/sites/13/2024/03/32-4-3.pdf',
                    },
                    {
                        name: 'An Invitation to Higher Arity Science',
                        pdf: 'https://content.wolfram.com/sites/13/2024/03/32-4-4.pdf',
                    },
                ],
            },
        ],
    ],
    [
        'Vol. 31',
        [
            {
                title: 'Vol. 31, No. 1',
                image: 'https://content.wolfram.com/sites/13/2022/03/JCS-31-1-outside-front.png',
                url: 'https://www.complex-systems.com/issues/31-1/',
                stories: [
                    {
                        name: 'The Kaleidoscopic Game of Life',
                        pdf: 'https://content.wolfram.com/sites/13/2022/03/31-1-1.pdf',
                    },
                    {
                        name: 'Cooperation and the Globalization-Localization Dilemmas',
                        pdf: 'https://content.wolfram.com/sites/13/2022/03/31-1-2.pdf',
                    },
                    {
                        name: 'Nonbinary Representations in the NK and NKCS Models',
                        pdf: 'https://content.wolfram.com/sites/13/2022/03/31-1-3.pdf',
                    },
                    {
                        name: 'Universal Criticality in Reservoir Computing Using Asynchronous Cellular Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2022/03/31-1-4.pdf',
                    },
                    {
                        name: 'Growth Functions, Rates and Classes of String-Based Multiway Systems',
                        pdf: 'https://content.wolfram.com/sites/13/2022/03/31-1-5.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 31, No. 2',
                image: 'https://content.wolfram.com/sites/13/2022/05/JCS-31-2-outfront.png',
                url: 'https://www.complex-systems.com/issues/31-2/',
                stories: [
                    {
                        name: 'Charting a Course for "Complexity": Metamodeling, Ruliology  and More',
                        pdf: 'https://content.wolfram.com/sites/13/2022/05/31-2-1.pdf',
                    },
                    {
                        name: 'Improved Majority Identification by the Coarsened  Majority Automaton',
                        pdf: 'https://content.wolfram.com/sites/13/2022/05/31-2-2.pdf',
                    },
                    {
                        name: 'The Effects of Interaction Functions between  Two Cellular Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2022/05/31-2-3.pdf',
                    },
                    {
                        name: 'Graph Matching with Distance-Preserving Crossover',
                        pdf: 'https://content.wolfram.com/sites/13/2022/06/31-2-4.pdf',
                    },
                    {
                        name: 'A Use of Variety as a Law of the Universe',
                        pdf: 'https://content.wolfram.com/sites/13/2022/05/31-2-5.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 31, No. 3',
                image: 'https://content.wolfram.com/sites/13/2022/10/JCS-31-3-outfront.png',
                url: 'https://www.complex-systems.com/issues/31-3/',
                stories: [
                    {
                        name: 'Homotopies in Multiway (Nondeterministic) Rewriting Systems as n-Fold Categories',
                        pdf: 'https://content.wolfram.com/sites/13/2022/10/31-3-1.pdf',
                    },
                    {
                        name: "Infinitely Growing Configurations in Emil Post's  Tag System Problem",
                        pdf: 'https://content.wolfram.com/sites/13/2022/10/31-3-2.pdf',
                    },
                    {
                        name: 'Dissipative Arithmetic',
                        pdf: 'https://content.wolfram.com/sites/13/2022/10/31-3-3.pdf',
                    },
                    {
                        name: 'Parametric Validation of the Reservoir Computing\u2013Based  Machine Learning Algorithm Applied to Lorenz System  Reconstructed Dynamics',
                        pdf: 'https://content.wolfram.com/sites/13/2022/10/31-3-4.pdf',
                    },
                    {
                        name: 'Elementary Cellular Automata along with Delay Sensitivity Can Model Communal Riot Dynamics',
                        pdf: 'https://content.wolfram.com/sites/13/2022/10/31-3-5.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 31, No. 4',
                image: 'https://content.wolfram.com/sites/13/2022/12/JCS-31-4-outside-front.png',
                url: 'https://www.complex-systems.com/issues/31-4/',
                stories: [
                    {
                        name: 'Characterization of Single Length Cycle Two-Attractor Cellular Automata Using Next-State Rule Minterm Transition Diagram',
                        pdf: 'https://content.wolfram.com/sites/13/2022/12/31-4-1.pdf',
                    },
                    {
                        name: 'Combining Algorithmic Information Dynamics Concepts and Machine Learning for Electroencephalography Analysis: What Can We Get?',
                        pdf: 'https://content.wolfram.com/sites/13/2022/12/31-4-2.pdf',
                    },
                    {
                        name: 'Operator Representation and Class Transitions in Elementary Cellular Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2022/12/31-4-3.pdf',
                    },
                    {
                        name: 'Formalizing the Use of the Activation Function in Neural Inference',
                        pdf: 'https://content.wolfram.com/sites/13/2022/12/31-4-4.pdf',
                    },
                ],
            },
        ],
    ],
    [
        'Vol. 30',
        [
            {
                title: 'Vol. 30, No. 1',
                image: 'https://content.wolfram.com/sites/13/2021/02/JCS-30-1-OutsideFront.png',
                url: 'https://www.complex-systems.com/issues/30-1/',
                stories: [
                    {
                        name: 'Tools to Characterize the Correlated Nature of Collective Dynamics',
                        pdf: 'https://content.wolfram.com/sites/13/2021/01/30-1-1.pdf',
                    },
                    {
                        name: 'Causal Paths in Temporal Networks of Face-to-Face Human Interactions',
                        pdf: 'https://content.wolfram.com/sites/13/2021/01/30-1-2.pdf',
                    },
                    {
                        name: 'Application of Coupled Map Lattice as an Alternative to Classical Finite Difference Method for Solving the Convection-Diffusion Boundary Value Problem',
                        pdf: 'https://content.wolfram.com/sites/13/2021/01/30-1-3.pdf',
                    },
                    {
                        name: 'Evolutions of Some One-Dimensional Homogeneous  Cellular Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2021/01/30-1-4.pdf',
                    },
                    {
                        name: 'Classification of Chaotic Behaviors in Jerky Dynamical Systems',
                        pdf: 'https://content.wolfram.com/sites/13/2021/01/30-1-5.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 30, No. 2',
                image: 'https://content.wolfram.com/sites/13/2021/04/JCS-30-2-outside-front.png',
                url: 'https://www.complex-systems.com/issues/30-2/',
                stories: [
                    {
                        name: 'String Generation by Cellular Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2021/04/30-2-1.pdf',
                    },
                    {
                        name: 'Besicovitch Pseudodistances with Respect to Non-Følner Sequences',
                        pdf: 'https://content.wolfram.com/sites/13/2021/04/30-2-2.pdf',
                    },
                    {
                        name: 'Self-Stabilizing Distributed Algorithms by Gellular Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2021/04/30-2-3.pdf',
                    },
                    {
                        name: 'Formal Logic of Cellular Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2021/04/30-2-4.pdf',
                    },
                    {
                        name: 'Clustering Using Cyclic Spaces of Reversible Cellular Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2021/04/30-2-5.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 30, No. 3',
                image: 'https://content.wolfram.com/sites/13/2021/09/JCS-30-3-outside-front.png',
                url: 'https://www.complex-systems.com/issues/30-3/',
                stories: [
                    {
                        name: 'Maximal Temporal Period of a Periodic Solution Generated by a One-Dimensional Cellular Automaton',
                        pdf: 'https://content.wolfram.com/sites/13/2021/07/30-3-1.pdf',
                    },
                    {
                        name: 'Spatial Signatures of Road Network Growth for Different Levels of Global Planning',
                        pdf: 'https://content.wolfram.com/sites/13/2021/07/30-3-2.pdf',
                    },
                    {
                        name: 'Studies of COVID-19 Outbreak Control Using Agent-Based Modeling',
                        pdf: 'https://content.wolfram.com/sites/13/2021/07/30-3-3.pdf',
                    },
                    {
                        name: 'A Control Approach to Guide Nonpharmaceutical Interventions in the Treatment of COVID-19 Disease Using a SEIHRD Dynamical Model',
                        pdf: 'https://content.wolfram.com/sites/13/2021/07/30-3-4.pdf',
                    },
                    {
                        name: 'What Keeps a Vibrant Population Together?',
                        pdf: 'https://content.wolfram.com/sites/13/2021/07/30-3-5.pdf',
                    },
                    {
                        name: 'Cryptographic Puzzles and Complex Systems',
                        pdf: 'https://content.wolfram.com/sites/13/2021/09/30-3-6.pdf',
                    },
                    {
                        name: 'Some Control and Observation Issues in Cellular Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2021/09/30-3-7.pdf',
                    },
                    {
                        name: 'Synthesis of Scalable Single Length Cycle, Single Attractor Cellular Automata in Linear Time',
                        pdf: 'https://content.wolfram.com/sites/13/2021/09/30-3-8.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 30, No. 4',
                image: 'https://content.wolfram.com/sites/13/2021/12/JCS-30-4-outside-front.png',
                url: 'https://www.complex-systems.com/issues/30-4/',
                stories: [
                    {
                        name: 'Extending Proximity Measures to Attributed Networks for Community Detection',
                        pdf: 'https://content.wolfram.com/sites/13/2021/12/30-4-1.pdf',
                    },
                    {
                        name: 'Transfer Learning for Node Regression Applied to Spreading Prediction',
                        pdf: 'https://content.wolfram.com/sites/13/2021/12/30-4-2.pdf',
                    },
                    {
                        name: 'A Self-Modeling Network Model Addressing Controlled Adaptive Mental Models for Analysis and Support Processes',
                        pdf: 'https://content.wolfram.com/sites/13/2021/12/30-4-3.pdf',
                    },
                    {
                        name: 'Impact of Nonlocal Interaction on Chimera States in Nonlocally Coupled Stuart\u2013Landau Oscillators',
                        pdf: 'https://content.wolfram.com/sites/13/2021/12/30-4-4.pdf',
                    },
                    {
                        name: 'The Impact of Edge Correlations in Random Networks',
                        pdf: 'https://content.wolfram.com/sites/13/2021/12/30-4-5.pdf',
                    },
                    {
                        name: 'Comparing Methods for Measuring Walkability',
                        pdf: 'https://content.wolfram.com/sites/13/2021/12/30-4-6.pdf',
                    },
                ],
            },
        ],
    ],
    [
        'Vol. 29',
        [
            {
                title: 'Vol. 29, No. 1',
                image: 'https://content.wolfram.com/sites/13/2020/04/JCS-29-1-Outside-front.png',
                url: 'https://www.complex-systems.com/issues/29-1/',
                stories: [
                    {
                        name: "Universality of Wolfram's 2, 3 Turing Machine",
                        pdf: 'https://content.wolfram.com/sites/13/2020/03/29-1-1.pdf',
                    },
                    {
                        name: 'Self-Replicability of Composite Graph Reproduction System',
                        pdf: 'https://content.wolfram.com/sites/13/2020/03/29-1-2.pdf',
                    },
                    {
                        name: "Max-Plus Generalization of Conway's Game of Life",
                        pdf: 'https://content.wolfram.com/sites/13/2020/04/29-1-3.pdf',
                    },
                    {
                        name: 'Automatization of Universal Cellular Automaton Discoveries: A New Approach to Stream Duplication',
                        pdf: 'https://content.wolfram.com/sites/13/2020/03/29-1-4.pdf',
                    },
                    {
                        name: 'An Agent-Based Model of COVID-19',
                        pdf: 'https://content.wolfram.com/sites/13/2020/04/29-1-5.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 29, No. 2',
                image: 'https://content.wolfram.com/sites/13/2020/07/JCS-29-2-Outside-Front.png',
                url: 'https://www.complex-systems.com/issues/29-2/',
                stories: [
                    {
                        name: 'A Class of Models with the Potential to Represent  Fundamental Physics',
                        pdf: 'https://files.wolframcdn.com/pub/www.complex-systems.com/29-2-1.pdf',
                    },
                    {
                        name: 'Some Quantum Mechanical Properties of the Wolfram Model',
                        pdf: 'https://content.wolfram.com/sites/13/2020/07/29-2-2.pdf',
                    },
                    {
                        name: 'Some Relativistic and Gravitational Properties  of the Wolfram Model',
                        pdf: 'https://content.wolfram.com/sites/13/2020/07/29-2-3.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 29, No. 3',
                image: 'https://content.wolfram.com/sites/13/2020/09/JCS-29-3-Outside-Front.png',
                url: 'https://www.complex-systems.com/issues/29-3/',
                stories: [
                    {
                        name: 'Special Issue of the 4th World Conference on Complex Systems (WCCS)',
                        pdf: 'https://content.wolfram.com/sites/13/2020/09/29-3-1.pdf',
                    },
                    {
                        name: 'Repression of Satisfaction as the Basis of the Emergence of Old World Complex Societies',
                        pdf: 'https://content.wolfram.com/sites/13/2020/09/29-3-2.pdf',
                    },
                    {
                        name: 'Efficient Solutions of the Density Classification Task in One-Dimensional Cellular Automata: Where Can They Be Found?',
                        pdf: 'https://content.wolfram.com/sites/13/2020/09/29-3-3.pdf',
                    },
                    {
                        name: 'The Effect of Keywords Used on Content Attraction in Complex Networks',
                        pdf: 'https://content.wolfram.com/sites/13/2020/09/29-3-4.pdf',
                    },
                    {
                        name: 'Load Balancing on the Data Center Broker Based on Game Theory and Metaheuristic Algorithms',
                        pdf: 'https://content.wolfram.com/sites/13/2020/09/29-3-5.pdf',
                    },
                    {
                        name: "Daubechies Wavelet Cepstral Coefficients for Parkinson's Disease Detection",
                        pdf: 'https://content.wolfram.com/sites/13/2020/09/29-3-6.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 29, No. 4',
                image: 'https://content.wolfram.com/sites/13/2020/11/JCS-29-4-OutsideFront.png',
                url: 'https://www.complex-systems.com/issues/29-4/',
                stories: [
                    {
                        name: 'Simulating Self-Regeneration and Self-Replication Processes Using Movable Cellular Automata with a Mutual Equilibrium Neighborhood',
                        pdf: 'https://content.wolfram.com/sites/13/2020/11/29-4-1.pdf',
                    },
                    {
                        name: 'Fungal Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2020/11/29-4-2.pdf',
                    },
                    {
                        name: 'A Review of Complex Systems Approaches to Cancer Networks',
                        pdf: 'https://content.wolfram.com/sites/13/2021/02/29-4-3.pdf',
                    },
                    {
                        name: 'An Improved Generalized Enumeration of Substitution Systems',
                        pdf: 'https://content.wolfram.com/sites/13/2020/11/29-4-4.pdf',
                    },
                    {
                        name: 'Prediction Diversity and Selective Attention in the Wisdom of Crowds',
                        pdf: 'https://content.wolfram.com/sites/13/2020/11/29-4-5.pdf',
                    },
                ],
            },
        ],
    ],
    [
        'Vol. 28',
        [
            {
                title: 'Vol. 28, No. 1',
                image: 'https://content.wolfram.com/sites/13/2019/04/JCS-28-1-outside-front.png',
                url: 'https://www.complex-systems.com/issues/28-1/',
                stories: [
                    {
                        name: 'Logic, Explainability and the Future of Understanding',
                        pdf: 'https://content.wolfram.com/sites/13/2019/04/28-1-1.pdf',
                    },
                    {
                        name: 'Chemical Excitable Medium in Barcelona Street Network as a Method for Panicked Crowds Behavior Analysis',
                        pdf: 'https://content.wolfram.com/sites/13/2019/04/28-1-2.pdf',
                    },
                    {
                        name: 'Detection of Movement toward Randomness by  Applying the Block Decomposition Method to a  Simple Model of the Circulatory System',
                        pdf: 'https://content.wolfram.com/sites/13/2019/04/28-1-3.pdf',
                    },
                    {
                        name: 'Dynamic Switching Networks',
                        pdf: 'https://content.wolfram.com/sites/13/2019/04/28-1-4.pdf',
                    },
                    {
                        name: 'The Effects of Boundary Conditions on Cellular Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2019/04/28-1-5.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 28, No. 2',
                image: 'https://content.wolfram.com/sites/13/2019/06/JCS-28-2-outside-front.png',
                url: 'https://www.complex-systems.com/issues/28-2/',
                stories: [
                    {
                        name: 'On Patterns and Dynamics of Rule 22 Cellular Automaton',
                        pdf: 'https://content.wolfram.com/sites/13/2019/06/28-2-1.pdf',
                    },
                    {
                        name: 'A Decidability Result for the Halting of Cellular Automata on the Pentagrid',
                        pdf: 'https://content.wolfram.com/sites/13/2019/06/28-2-2.pdf',
                    },
                    {
                        name: 'Strong and Weak Spatial Segregation with Multilevel Discrimination Criteria',
                        pdf: 'https://content.wolfram.com/sites/13/2019/06/28-2-3.pdf',
                    },
                    {
                        name: 'A Measure for the Complexity of Elementary Cellular Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2019/06/28-2-4.pdf',
                    },
                    {
                        name: 'Neural Control Model for an Inverted Double Pendulum',
                        pdf: 'https://content.wolfram.com/sites/13/2019/06/28-2-5.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 28, No. 3',
                image: 'https://content.wolfram.com/sites/13/2019/10/JCS-28-3-OutFront.png',
                url: 'https://www.complex-systems.com/issues/28-3/',
                stories: [
                    {
                        name: 'Lenia: Biology of Artificial Life',
                        pdf: 'https://content.wolfram.com/sites/13/2019/10/28-3-1.pdf',
                    },
                    {
                        name: 'Urbanization, Energy Consumption and Entropy of Metropolises',
                        pdf: 'https://content.wolfram.com/sites/13/2019/10/28-3-2.pdf',
                    },
                    {
                        name: 'Graph Self-Replication System',
                        pdf: 'https://content.wolfram.com/sites/13/2019/10/28-3-3.pdf',
                    },
                    {
                        name: 'Relevance and Importance Preferential Attachment',
                        pdf: 'https://content.wolfram.com/sites/13/2019/10/28-3-4.pdf',
                    },
                    {
                        name: 'Statistical Complexity of Boolean Cellular Automata with Short-Term Reaction-Diffusion Memory on a Square Lattice',
                        pdf: 'https://content.wolfram.com/sites/13/2019/10/28-3-5.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 28, No. 4',
                image: 'https://content.wolfram.com/sites/13/2019/12/28-4-Outside-Front.png',
                url: 'https://www.complex-systems.com/issues/28-4/',
                stories: [
                    {
                        name: 'Quantum Cellular Automata, Black Hole Thermodynamics and the Laws of Quantum Complexity',
                        pdf: 'https://content.wolfram.com/sites/13/2019/12/28-4-1.pdf',
                    },
                    {
                        name: 'Methodological Approaches for the Fokker\u2013Planck Equation Associated to Nonlinear Stochastic Differential Systems with Uncertain Parameters',
                        pdf: 'https://content.wolfram.com/sites/13/2019/12/28-4-2.pdf',
                    },
                    {
                        name: 'Reservoir Computing with Complex Cellular Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2019/12/28-4-3.pdf',
                    },
                    {
                        name: 'Secure and Computationally Efficient Cryptographic Primitive Based on Cellular Automaton',
                        pdf: 'https://content.wolfram.com/sites/13/2019/12/28-4-4.pdf',
                    },
                    {
                        name: 'Modeling the Spread of Suicide in Greece',
                        pdf: 'https://content.wolfram.com/sites/13/2019/12/28-4-5.pdf',
                    },
                ],
            },
        ],
    ],
    [
        'Vol. 27',
        [
            {
                title: 'Vol. 27, No. 1',
                image: 'https://content.wolfram.com/sites/13/2018/04/JCS-27-1-front-large.png',
                url: 'https://www.complex-systems.com/issues/27-1/',
                stories: [
                    {
                        name: 'Logical Universality from a Minimal Two-Dimensional Glider Gun',
                        pdf: 'https://content.wolfram.com/sites/13/2018/07/27-1-1.pdf',
                    },
                    {
                        name: 'Wireworld++: A Cellular Automaton for Simulation of Nonplanar Digital  Electronic Circuits',
                        pdf: 'https://content.wolfram.com/sites/13/2018/07/27-1-2.pdf',
                    },
                    {
                        name: 'Definition and Identification of Information Storage and Processing Capabilities as Possible Markers for Turing Universality in Cellular Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2018/07/27-1-3.pdf',
                    },
                    {
                        name: 'Two-Step Markov Update Algorithm for Accuracy-Based Learning Classifier Systems',
                        pdf: 'https://content.wolfram.com/sites/13/2018/07/27-1-4.pdf',
                    },
                    {
                        name: 'Exploring Halting Times for Unconventional Halting Schemes',
                        pdf: 'https://content.wolfram.com/sites/13/2018/07/27-1-5.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 27, No. 2',
                image: 'https://content.wolfram.com/sites/13/2018/06/JCS-27-2-OutsideFront.png',
                url: 'https://www.complex-systems.com/issues/27-2/',
                stories: [
                    {
                        name: 'The Time Evolution of a Greenberg\u2013Hastings Cellular Automaton on a Finite Graph',
                        pdf: 'https://content.wolfram.com/sites/13/2018/09/27-2-1.pdf',
                    },
                    {
                        name: 'Nonlocal and Light Cone Dynamics Emergent from Information-Propagating Complete Graph',
                        pdf: 'https://content.wolfram.com/sites/13/2018/09/27-2-2.pdf',
                    },
                    {
                        name: 'Using Elementary Cellular Automata to Model Different Research Strategies and the Generation of New Knowledge',
                        pdf: 'https://content.wolfram.com/sites/13/2018/09/27-2-3.pdf',
                    },
                    {
                        name: 'Complexity Steering in Cellular Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2018/09/27-2-4.pdf',
                    },
                    {
                        name: 'The Slowdown Theorem: A Lower Bound for Computational Irreducibility in Physical Systems',
                        pdf: 'https://content.wolfram.com/sites/13/2018/09/27-2-5.pdf',
                    },
                    {
                        name: 'Hetero-Correlation-Associative Memory with Trigger Neurons: Accumulation of Memory through Additional Learning in Neural Networks',
                        pdf: 'https://content.wolfram.com/sites/13/2018/09/27-2-6.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 27, No. 3',
                image: 'https://content.wolfram.com/sites/13/2018/09/JCS-27-3-OutsideFront.png',
                url: 'https://www.complex-systems.com/issues/27-3/',
                stories: [
                    {
                        name: 'Synthetic Biology and Artificial Intelligence: Toward Cross-Fertilization',
                        pdf: 'https://content.wolfram.com/sites/13/2018/12/27-3-1.pdf',
                    },
                    {
                        name: 'Synthetic Biology and Artificial Intelligence: Grounding a Cross-Disciplinary Approach to the Synthetic Exploration of (Embodied) Cognition',
                        pdf: 'https://content.wolfram.com/sites/13/2018/12/27-3-2.pdf',
                    },
                    {
                        name: 'Attractor Landscape: A Bridge between Robotics and Synthetic Biology',
                        pdf: 'https://content.wolfram.com/sites/13/2018/12/27-3-3.pdf',
                    },
                    {
                        name: 'The Problem of Prediction in Artificial Intelligence and Synthetic Biology',
                        pdf: 'https://content.wolfram.com/sites/13/2018/12/27-3-4.pdf',
                    },
                    {
                        name: 'Synthetic Modelling of Biological Communication: A Theoretical and Operational Framework for the Investigation of Minimal Life and Cognition',
                        pdf: 'https://content.wolfram.com/sites/13/2018/12/27-3-5.pdf',
                    },
                    {
                        name: 'On Minimal Autonomous Agency: Natural and Artificial',
                        pdf: 'https://content.wolfram.com/sites/13/2018/12/27-3-6.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 27, No. 4',
                image: 'https://content.wolfram.com/sites/13/2018/12/JCS-27-4-OutsideFront.png',
                url: 'https://www.complex-systems.com/issues/27-4/',
                stories: [
                    {
                        name: 'A Weakly Universal Cellular Automaton in the Heptagrid of the Hyperbolic Plane',
                        pdf: 'https://content.wolfram.com/sites/13/2018/12/27-4-1.pdf',
                    },
                    {
                        name: 'Statistical Scaling Laws for Competing Biological Species',
                        pdf: 'https://content.wolfram.com/sites/13/2018/12/27-4-2.pdf',
                    },
                    {
                        name: 'Emergent Open-Endedness from Contagion of the Fittest',
                        pdf: 'https://content.wolfram.com/sites/13/2018/12/27-4-3.pdf',
                    },
                    {
                        name: 'Universal Emergence of 1|f Noise in Asynchronously Tuned Elementary Cellular Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2018/12/27-4-4.pdf',
                    },
                    {
                        name: 'Replication of a Binary Image on a One-Dimensional Cellular Automaton with Linear Rules',
                        pdf: 'https://content.wolfram.com/sites/13/2018/12/27-4-5.pdf',
                    },
                ],
            },
        ],
    ],
    [
        'Vol. 26',
        [
            {
                title: 'Vol. 26, No. 1',
                image: 'https://content.wolfram.com/sites/13/2018/02/26_1.png',
                url: 'https://www.complex-systems.com/issues/26-1/',
                stories: [
                    {
                        name: 'Rigorous Measurement of the Internet Degree Distribution',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/26-1-1.pdf',
                    },
                    {
                        name: 'Uncertain Density Balance Triggers Scale-Free Evolution in Game of Life',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/26-1-2.pdf',
                    },
                    {
                        name: 'A Language for Particle Interactions in Rule 54 and Other Cellular Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/26-1-3.pdf',
                    },
                    {
                        name: 'Emergence and Electrophysiological Analogies in Jellium Models for Cortical Brain Matter',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/26-1-4.pdf',
                    },
                    {
                        name: 'Predicting the Large-Scale Evolution of Tag Systems: Code  Supplement',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/26-1-5.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 26, No. 2',
                image: 'https://content.wolfram.com/sites/13/2018/02/26-2.png',
                url: 'https://www.complex-systems.com/issues/26-2/',
                stories: [
                    {
                        name: 'Iterations, Wolfram Sequences and Approximate Closed Formulas',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/26-2-1.pdf',
                    },
                    {
                        name: 'Patterns in Combinator Evolution',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/26-2-2.pdf',
                    },
                    {
                        name: 'Ecological Theory Explains Why Diverse Island Economies Are More Stable',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/26-2-3.pdf',
                    },
                    {
                        name: 'Infinite Petri Nets: Part 1, Modeling Square Grid Structures',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/26-2-4.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 26, No. 3',
                image: 'https://content.wolfram.com/sites/13/2018/02/26-3.png',
                url: 'https://www.complex-systems.com/issues/26-3/',
                stories: [
                    {
                        name: 'A New Kind of Science: A 15-Year View',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/26-3-1.pdf',
                    },
                    {
                        name: 'Reservoir Computing Using Nonuniform Binary Cellular Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/26-3-2.pdf',
                    },
                    {
                        name: 'The "Two\'s Company, Three\'s a Crowd" Game',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/26-3-3.pdf',
                    },
                    {
                        name: 'Behavior Classification for Turing Machines',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/26-3-4.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 26, No. 4',
                image: 'https://content.wolfram.com/sites/13/2018/02/26-4.png',
                url: 'https://www.complex-systems.com/issues/26-4/',
                stories: [
                    {
                        name: 'On the Dynamics of Excitation and Information Processing in F-actin: Automaton Model',
                        pdf: 'https://content.wolfram.com/sites/13/2018/04/26-4-1.pdf',
                    },
                    {
                        name: 'Deep Learning with Cellular Automaton-Based Reservoir  Computing',
                        pdf: 'https://content.wolfram.com/sites/13/2018/04/26-4-2.pdf',
                    },
                    {
                        name: 'Infinite Petri Nets: Part 2, Modeling Triangular, Hexagonal, Hypercube and Hypertorus Structures',
                        pdf: 'https://content.wolfram.com/sites/13/2018/04/26-4-3.pdf',
                    },
                    {
                        name: 'Cellular Automaton-Based Pseudorandom Number Generator',
                        pdf: 'https://content.wolfram.com/sites/13/2018/04/26-4-4.pdf',
                    },
                ],
            },
        ],
    ],
    [
        'Vol. 25',
        [
            {
                title: 'Vol. 25, No. 1',
                image: 'https://content.wolfram.com/sites/13/2018/02/25_1.png',
                url: 'https://www.complex-systems.com/issues/25-1/',
                stories: [
                    {
                        name: 'Coexistence of Dynamics for Two-Dimensional Cellular Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/25-1-1.pdf',
                    },
                    {
                        name: 'Commutative Cellular Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/25-1-2.pdf',
                    },
                    {
                        name: 'How External Environment and Internal Structure Change the Behavior of Discrete Systems',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/25-1-3.pdf',
                    },
                    {
                        name: 'A Symbolic Dynamics Perspective of the Game of Three-Dimensional Life',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/25-1-4.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 25, No. 2',
                image: 'https://content.wolfram.com/sites/13/2018/02/25_2.png',
                url: 'https://www.complex-systems.com/issues/25-2/',
                stories: [
                    {
                        name: 'Predicting the Large-Scale Evolution of Tag Systems',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/25-2-1.pdf',
                    },
                    {
                        name: 'A Glimpse of the Mandelbulb with Memory',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/25-2-2.pdf',
                    },
                    {
                        name: 'On Complexity of Persian Orthography: L-Systems Approach',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/25-2-3.pdf',
                    },
                    {
                        name: 'Interaction Strength Is Key to Persistence of Complex Mutualistic Networks',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/25-2-4.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 25, No. 3',
                image: 'https://content.wolfram.com/sites/13/2018/02/25_3.png',
                url: 'https://www.complex-systems.com/issues/25-3/',
                stories: [
                    {
                        name: 'Segregation Landscape: A New View on the Schelling Segregation Space',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/25-3-1.pdf',
                    },
                    {
                        name: 'Phenomenology of Tensor Modulation in Elementary Kinetic Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/25-3-2.pdf',
                    },
                    {
                        name: 'Distance Distribution between Complex Network Nodes in Hyperbolic Space',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/25-3-3.pdf',
                    },
                    {
                        name: 'On Half-Adders Based on Fusion of Signal Carriers: Excitation, Fluidics, and Electricity',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/25-3-4.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 25, No. 4',
                image: 'https://content.wolfram.com/sites/13/2018/02/25_4.png',
                url: 'https://www.complex-systems.com/issues/25-4/',
                stories: [
                    {
                        name: 'Introduction to "Black Hole Tech?"',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/25-4-1.pdf',
                    },
                    {
                        name: 'Black Hole Tech?',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/25-4-2.pdf',
                    },
                    {
                        name: 'Code 1599 Cellular Automaton New Patterns',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/25-4-3.pdf',
                    },
                    {
                        name: 'A Relatively Small Turing Machine Whose Behavior Is Independent of Set Theory',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/25-4-4.pdf',
                    },
                    {
                        name: 'On the Number of NK-Kauffman Networks Mapped into a Functional Graph',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/25-4-5.pdf',
                    },
                ],
            },
        ],
    ],
    [
        'Vol. 24',
        [
            {
                title: 'Vol. 24, No. 1',
                image: 'https://content.wolfram.com/sites/13/2018/02/24_1.png',
                url: 'https://www.complex-systems.com/issues/24-1/',
                stories: [
                    {
                        name: 'Search of Complex Binary Cellular Automata Using Behavioral  Metrics',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/24-1-1.pdf',
                    },
                    {
                        name: 'Partitioning of Cellular Automata Rule Spaces',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/24-1-2.pdf',
                    },
                    {
                        name: 'Which Types of Learning Make a Simple Game Complex?',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/24-1-3.pdf',
                    },
                    {
                        name: 'Emergence and Collapse of Order in Mutually Imitating Agents',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/24-1-4.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 24, No. 2',
                image: 'https://content.wolfram.com/sites/13/2018/02/24_2.png',
                url: 'https://www.complex-systems.com/issues/24-2/',
                stories: [
                    {
                        name: 'Error-Prone Cellular Automata as Metaphors of Immunity as Computation',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/24-2-1.pdf',
                    },
                    {
                        name: 'Two Elementary Cellular Automata with a New Kind of Dynamic',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/24-2-2.pdf',
                    },
                    {
                        name: 'Information Approach to Co-occurrence of Words in Written Language',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/24-2-3.pdf',
                    },
                    {
                        name: 'Computational Irreducibility and Computational Analogy',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/24-2-4.pdf',
                    },
                    {
                        name: 'Self-Organizing Traffic Lights as an Upper Bound Estimate',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/24-2-5.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 24, No. 3',
                image: 'https://content.wolfram.com/sites/13/2018/02/24_3.png',
                url: 'https://www.complex-systems.com/issues/24-3/',
                stories: [
                    {
                        name: 'Glider Collisions in Hybrid Cellular Automaton Rules',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/24-3-1.pdf',
                    },
                    {
                        name: 'On Quaternion Maps with Memory',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/24-3-2.pdf',
                    },
                    {
                        name: 'Hexagonal Lattice Systems Based on Rotationally Invariant  Constraints',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/24-3-3.pdf',
                    },
                    {
                        name: 'Complex Beauty',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/24-3-4.pdf',
                    },
                    {
                        name: 'A General N-Person Game Solver for Pavlovian Agents',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/24-3-5.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 24, No. 4',
                image: 'https://content.wolfram.com/sites/13/2018/02/24_4.png',
                url: 'https://www.complex-systems.com/issues/24-4/',
                stories: [
                    {
                        name: 'A Pit of Flowsnakes',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/24-4-1.pdf',
                    },
                    {
                        name: 'Study of All the Periods of a Neuronal Recurrence Equation',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/24-4-2.pdf',
                    },
                    {
                        name: 'On the Structure of Multilayer Cellular Neural Networks: Complexity between Two Layers',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/24-4-3.pdf',
                    },
                ],
            },
        ],
    ],
    [
        'Vol. 23',
        [
            {
                title: 'Vol. 23, No. 1',
                image: 'https://content.wolfram.com/sites/13/2018/02/23_1.png',
                url: 'https://www.complex-systems.com/issues/23-1/',
                stories: [
                    {
                        name: 'Exponential Convergence to Equilibrium in Cellular Automata Asymptotically Emulating Identity',
                        pdf: 'https://content.wolfram.com/sites/13/2018/12/23-1-1.pdf',
                    },
                    {
                        name: 'System Behaviors and Measures: Compressed State Complexity and Number of Unique States Used in Naval Weapons Elevators',
                        pdf: 'https://content.wolfram.com/sites/13/2018/12/23-1-2.pdf',
                    },
                    {
                        name: 'Self-Organized Criticality in Asynchronously Tuned Elementary Cellular Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2018/12/23-1-3.pdf',
                    },
                    {
                        name: 'Finite-Size Effects in the Dependency Networks of Free and Open-Source Software',
                        pdf: 'https://content.wolfram.com/sites/13/2018/12/23-1-4.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 23, No. 2',
                image: 'https://content.wolfram.com/sites/13/2018/02/23_2.png',
                url: 'https://www.complex-systems.com/issues/23-2/',
                stories: [
                    {
                        name: 'Complex Behavior in Long-Distance Cellular Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2018/12/23-2-1.pdf',
                    },
                    {
                        name: 'Retrospective-Prospective Differential Inclusions and Their Control by the Differential Connection Tensors of Their Evolutions: The Trendometer',
                        pdf: 'https://content.wolfram.com/sites/13/2018/12/23-2-2.pdf',
                    },
                    {
                        name: 'System Behaviors and Measures: Static Measures of Complexity in Naval Weapons Elevators, Alternative Logic, and Mobile Carriage Systems',
                        pdf: 'https://content.wolfram.com/sites/13/2018/12/23-2-3.pdf',
                    },
                    {
                        name: 'Number Conservation Property of Elementary Cellular Automata under Asynchronous Update',
                        pdf: 'https://content.wolfram.com/sites/13/2018/12/23-2-4.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 23, No. 3',
                image: 'https://content.wolfram.com/sites/13/2018/02/23_3.png',
                url: 'https://www.complex-systems.com/issues/23-3/',
                stories: [
                    {
                        name: 'Small-World Properties of Facebook Group Networks',
                        pdf: 'https://content.wolfram.com/sites/13/2018/12/23-3-1.pdf',
                    },
                    {
                        name: 'The Mandelbrot Set with Partial Memory',
                        pdf: 'https://content.wolfram.com/sites/13/2018/12/23-3-2.pdf',
                    },
                    {
                        name: 'Decentralized Adaptive Fault-Tolerant Control for Complex Systems with Actuator Faults',
                        pdf: 'https://content.wolfram.com/sites/13/2018/12/23-3-3.pdf',
                    },
                    {
                        name: 'Complete Characterization of Structure of Rule 54',
                        pdf: 'https://content.wolfram.com/sites/13/2018/12/23-3-4.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 23, No. 4',
                image: 'https://content.wolfram.com/sites/13/2018/02/23_4.png',
                url: 'https://www.complex-systems.com/issues/23-4/',
                stories: [
                    {
                        name: 'The Effect of Network Structure on Individual Behavior',
                        pdf: 'https://content.wolfram.com/sites/13/2018/12/23-4-1.pdf',
                    },
                    {
                        name: 'A Max-Plus Model of Asynchronous Cellular Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2018/12/23-4-2.pdf',
                    },
                    {
                        name: 'The Influence of Grid Rotation in von Neumann and Moore Neighborhoods on Agent Behavior in Pedestrian Simulation',
                        pdf: 'https://content.wolfram.com/sites/13/2018/12/23-4-3.pdf',
                    },
                    {
                        name: 'Cellular Automata Complexity Threshold and Classification: A Geometric Perspective',
                        pdf: 'https://content.wolfram.com/sites/13/2018/12/23-4-4.pdf',
                    },
                ],
            },
        ],
    ],
    [
        'Vol. 22',
        [
            {
                title: 'Vol. 22, No. 1',
                image: 'https://content.wolfram.com/sites/13/2018/02/22_1.png',
                url: 'https://www.complex-systems.com/issues/22-1/',
                stories: [
                    {
                        name: 'Exploring the Space of Substitution Systems',
                        pdf: 'https://content.wolfram.com/sites/13/2018/12/22-1-1.pdf',
                    },
                    {
                        name: 'Emergence of Frontiers in Networked Schelling  Segregationist Models',
                        pdf: 'https://content.wolfram.com/sites/13/2018/12/22-1-2.pdf',
                    },
                    {
                        name: 'Schizophrenic Representative Investors',
                        pdf: 'https://content.wolfram.com/sites/13/2018/12/22-1-3.pdf',
                    },
                    {
                        name: 'Continuum versus Discrete: A Physically Interpretable General Rule for Cellular Automata by Means of Modular Arithmetic',
                        pdf: 'https://content.wolfram.com/sites/13/2018/12/22-1-4.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 22, No. 2',
                image: 'https://content.wolfram.com/sites/13/2018/02/22_2.png',
                url: 'https://www.complex-systems.com/issues/22-2/',
                stories: [
                    {
                        name: 'Discovering Nontrivial and Functional Behavior in Register Machines',
                        pdf: 'https://content.wolfram.com/sites/13/2018/12/22-2-1.pdf',
                    },
                    {
                        name: 'Complex Networks from Simple Rules',
                        pdf: 'https://content.wolfram.com/sites/13/2018/12/22-2-2.pdf',
                    },
                    {
                        name: 'Large-Scale Modeling of Economic Systems',
                        pdf: 'https://content.wolfram.com/sites/13/2018/12/22-2-3.pdf',
                    },
                    {
                        name: 'Information Flow in Cellular Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2018/12/22-2-4.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 22, No. 3',
                image: 'https://content.wolfram.com/sites/13/2018/02/22_3.png',
                url: 'https://www.complex-systems.com/issues/22-3/',
                stories: [
                    {
                        name: 'On the Scalability and Convergence of Simultaneous Parameter Identification and Synchronization of Dynamical Systems',
                        pdf: 'https://content.wolfram.com/sites/13/2018/12/22-3-1.pdf',
                    },
                    {
                        name: 'Market Shares Are Not Zipf-Distributed',
                        pdf: 'https://content.wolfram.com/sites/13/2018/12/22-3-2.pdf',
                    },
                    {
                        name: 'High-Probability Trajectories in the Phase Space and the System Complexity',
                        pdf: 'https://content.wolfram.com/sites/13/2018/12/22-3-3.pdf',
                    },
                    {
                        name: 'System Behaviors and Measures: Logical Complexity and State Complexity in Naval Weapons Elevators',
                        pdf: 'https://content.wolfram.com/sites/13/2018/12/22-3-4.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 22, No. 4',
                image: 'https://content.wolfram.com/sites/13/2018/02/22_4.png',
                url: 'https://www.complex-systems.com/issues/22-4/',
                stories: [
                    {
                        name: 'Graphic Lambda Calculus',
                        pdf: 'https://content.wolfram.com/sites/13/2018/12/22-4-1.pdf',
                    },
                    {
                        name: 'On Creativity and Elementary Cellular Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2018/12/22-4-2.pdf',
                    },
                    {
                        name: 'An Efficient Algorithm for the Detection of Eden',
                        pdf: 'https://content.wolfram.com/sites/13/2018/12/22-4-3.pdf',
                    },
                    {
                        name: 'On the Iota-Delta Function: Mathematical Representation of Two-Dimensional Cellular Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2018/12/22-4-4.pdf',
                    },
                    {
                        name: 'Comparison of Dynamic Diffusion with an Explicit Difference Scheme for the Schrödinger Equation',
                        pdf: 'https://content.wolfram.com/sites/13/2018/12/22-4-5.pdf',
                    },
                ],
            },
        ],
    ],
    [
        'Vol. 21',
        [
            {
                title: 'Vol. 21, No. 1',
                image: 'https://content.wolfram.com/sites/13/2018/02/21_1.jpg',
                url: 'https://www.complex-systems.com/issues/21-1/',
                stories: [
                    {
                        name: 'Slime Mold Imitates the United States Interstate System',
                        pdf: 'https://content.wolfram.com/sites/13/2018/12/21-1-1.pdf',
                    },
                    {
                        name: 'Why Should an Economy Be Competitive?',
                        pdf: 'https://content.wolfram.com/sites/13/2018/12/21-1-2.pdf',
                    },
                    {
                        name: "Correction of Dynamical Network's Viability by Decentralization by Price",
                        pdf: 'https://content.wolfram.com/sites/13/2018/12/21-1-3.pdf',
                    },
                    {
                        name: 'Evolving Interesting Initial Conditions for Cellular Automata of the Game of Life Type',
                        pdf: 'https://content.wolfram.com/sites/13/2018/12/21-1-4.pdf',
                    },
                    {
                        name: 'Reversibility in Asynchronous Cellular Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2018/12/21-1-5.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 21, No. 2',
                image: 'https://content.wolfram.com/sites/13/2018/02/21_2.jpg',
                url: 'https://www.complex-systems.com/issues/21-2/',
                stories: [
                    {
                        name: 'Boundary Growth in One-Dimensional Cellular Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2018/12/21-2-1.pdf',
                    },
                    {
                        name: 'On Soliton Collisions between Localizations in Complex Elementary Cellular Automata: Rules 54 and 110 and Beyond',
                        pdf: 'https://content.wolfram.com/sites/13/2018/12/21-2-2.pdf',
                    },
                    {
                        name: 'Cellular Nonlinear Networks to Analyze the Complexity of Foggy Paintings',
                        pdf: 'https://content.wolfram.com/sites/13/2018/12/21-2-3.pdf',
                    },
                    {
                        name: 'The El Farol Bar Problem as an Iterated N-Person Game',
                        pdf: 'https://content.wolfram.com/sites/13/2018/12/21-2-4.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 21, No. 3',
                image: 'https://content.wolfram.com/sites/13/2018/02/21_3.png',
                url: 'https://www.complex-systems.com/issues/21-3/',
                stories: [
                    {
                        name: 'Robustness of Multi-agent Models: The Example of Collaboration between Turmites with Synchronous and Asynchronous Updating',
                        pdf: 'https://content.wolfram.com/sites/13/2018/12/21-3-1.pdf',
                    },
                    {
                        name: 'Pushing the Complexity Barrier: Diminishing Returns in the Sciences',
                        pdf: 'https://content.wolfram.com/sites/13/2018/12/21-3-2.pdf',
                    },
                    {
                        name: 'Discriminating Chaotic Time Series with Visibility Graph Eigenvalues',
                        pdf: 'https://content.wolfram.com/sites/13/2018/12/21-3-3.pdf',
                    },
                    {
                        name: 'Investigation of N-Person Games by Agent-Based Modeling',
                        pdf: 'https://content.wolfram.com/sites/13/2018/12/21-3-4.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 21, No. 4',
                image: 'https://content.wolfram.com/sites/13/2018/02/21_4.png',
                url: 'https://www.complex-systems.com/issues/21-4/',
                stories: [
                    {
                        name: 'On the Complexity of the Abelian Sandpile Model: Communication Complexity and Statistical Mechanics',
                        pdf: 'https://content.wolfram.com/sites/13/2018/12/21-4-1.pdf',
                    },
                    {
                        name: 'A Glimpse of Complex Maps with Memory',
                        pdf: 'https://content.wolfram.com/sites/13/2018/12/21-4-2.pdf',
                    },
                    {
                        name: "On the Iota-Delta Function: Universality in Cellular Automata's Representation",
                        pdf: 'https://content.wolfram.com/sites/13/2018/12/21-4-3.pdf',
                    },
                    {
                        name: 'Initial-Condition Estimation in Network Synchronization Processes: Algebraic and Graphical Characterizations of the Estimator',
                        pdf: 'https://content.wolfram.com/sites/13/2018/12/21-4-4.pdf',
                    },
                ],
            },
        ],
    ],
    [
        'Vol. 20',
        [
            {
                title: 'Vol. 20, No. 1',
                image: 'https://content.wolfram.com/sites/13/2018/02/20_1.gif',
                url: 'https://www.complex-systems.com/issues/20-1/',
                stories: [
                    {
                        name: 'The Quadratic Assignment Problem in Code Optimization for a Simple Universal Turing Machine',
                        pdf: 'https://content.wolfram.com/sites/13/2019/01/20-1-1.pdf',
                    },
                    {
                        name: 'A Radar for the Internet',
                        pdf: 'https://content.wolfram.com/sites/13/2019/01/20-1-2.pdf',
                    },
                    {
                        name: 'Complex Shift Dynamics of Some Elementary Cellular Automaton Rules',
                        pdf: 'https://content.wolfram.com/sites/13/2019/01/20-1-3.pdf',
                    },
                    {
                        name: 'On Invertible Three Neighborhood Null-Boundary Uniform Cellular Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2019/01/20-1-4.pdf',
                    },
                    {
                        name: 'Cellular Automata in Complex Matter',
                        pdf: 'https://content.wolfram.com/sites/13/2019/01/20-1-5.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 20, No. 2',
                image: 'https://content.wolfram.com/sites/13/2018/02/20_2.jpg',
                url: 'https://www.complex-systems.com/issues/20-2/',
                stories: [
                    {
                        name: 'A Short Foreword to the "2011 Interdisciplinary Symposium on Complex Systems"',
                        pdf: 'https://content.wolfram.com/sites/13/2019/01/20-2-1.pdf',
                    },
                    {
                        name: 'Robust Soldier Crab Ball Gate',
                        pdf: 'https://content.wolfram.com/sites/13/2019/01/20-2-2.pdf',
                    },
                    {
                        name: 'The New Science of Cryodynamics and Its Connection to Cosmology',
                        pdf: 'https://content.wolfram.com/sites/13/2019/01/20-2-3.pdf',
                    },
                    {
                        name: 'Spin Glasses: Old and New Complexity',
                        pdf: 'https://content.wolfram.com/sites/13/2019/01/20-2-4.pdf',
                    },
                    {
                        name: 'Do Evolutionary Algorithm Dynamics Create Complex Network Structures?',
                        pdf: 'https://content.wolfram.com/sites/13/2019/01/20-2-5.pdf',
                    },
                    {
                        name: 'Systematic Prediction of Dyes for Dye-Sensitized Solar Cells: Data Mining via Molecular Charge-Transfer Algorithms',
                        pdf: 'https://content.wolfram.com/sites/13/2019/01/20-2-6.pdf',
                    },
                    {
                        name: 'Novel Properties Generated by Interacting Computational Systems',
                        pdf: 'https://content.wolfram.com/sites/13/2019/01/20-2-7.pdf',
                    },
                    {
                        name: 'Decomposability of Multivariate Interactions',
                        pdf: 'https://content.wolfram.com/sites/13/2019/01/20-2-8.pdf',
                    },
                    {
                        name: 'Atmospheric Pressure Plasma Acoustic Moment Analysis',
                        pdf: 'https://content.wolfram.com/sites/13/2019/01/20-2-9.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 20, No. 3',
                image: 'https://content.wolfram.com/sites/13/2018/02/20_3.png',
                url: 'https://www.complex-systems.com/issues/20-3/',
                stories: [
                    {
                        name: 'A Short Foreword to the "2011 Interdisciplinary Symposium on Complex Systems"',
                        pdf: 'https://content.wolfram.com/sites/13/2019/01/20-3-1.pdf',
                    },
                    {
                        name: 'On Simple Energy\u2014Complexity Relations for Filament Tangles and Networks',
                        pdf: 'https://content.wolfram.com/sites/13/2019/01/20-3-2.pdf',
                    },
                    {
                        name: 'Evolutionary Chaos Controller Synthesis for Stabilizing Chaotic Hénon Maps',
                        pdf: 'https://content.wolfram.com/sites/13/2019/01/20-3-3.pdf',
                    },
                    {
                        name: 'Three-Dimensional Spatio-Temporal Modeling of Geophysical Events and the Movement of Celestial Bodies',
                        pdf: 'https://content.wolfram.com/sites/13/2019/01/20-3-4.pdf',
                    },
                    {
                        name: 'Modification of Gaussian Elimination for the Complex System of Seismic Observations',
                        pdf: 'https://content.wolfram.com/sites/13/2019/01/20-3-5.pdf',
                    },
                    {
                        name: 'Robot Control through Brain-Computer Interface for Pattern Generation',
                        pdf: 'https://content.wolfram.com/sites/13/2019/01/20-3-6.pdf',
                    },
                    {
                        name: 'Complexity as a Linguistic Variable',
                        pdf: 'https://content.wolfram.com/sites/13/2019/01/20-3-7.pdf',
                    },
                    {
                        name: 'On the Dynamic Qualitative Behavior of Universal Computation',
                        pdf: 'https://content.wolfram.com/sites/13/2019/01/20-3-8.pdf',
                    },
                    {
                        name: 'Pinning Control in a System of Mobile Chaotic Oscillators',
                        pdf: 'https://content.wolfram.com/sites/13/2019/01/20-3-9.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 20, No. 4',
                image: 'https://content.wolfram.com/sites/13/2018/02/20_4.png',
                url: 'https://www.complex-systems.com/issues/20-4/',
                stories: [
                    {
                        name: 'Self-Correlations of Electroencephalograms',
                        pdf: 'https://content.wolfram.com/sites/13/2019/01/20-4-1.pdf',
                    },
                    {
                        name: 'Assessment of Geriatric-Specific Changes in Brain Texture Complexity Using a Backpropagation Neural Network Classifier',
                        pdf: 'https://content.wolfram.com/sites/13/2019/01/20-4-2.pdf',
                    },
                    {
                        name: 'Period-Halving Bifurcation of a Neuronal Recurrence Equation',
                        pdf: 'https://content.wolfram.com/sites/13/2019/01/20-4-3.pdf',
                    },
                    {
                        name: 'Symmetry and Entropy of One-Dimensional Legal Cellular Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2019/01/20-4-4.pdf',
                    },
                    {
                        name: 'Cooperation, Punishment, Emergence of Government, and the Tragedy of Authorities',
                        pdf: 'https://content.wolfram.com/sites/13/2019/01/20-4-5.pdf',
                    },
                    {
                        name: 'From Meander Designs to a Routing Application Using a Shape Grammar to Cellular Automata Methodology',
                        pdf: 'https://content.wolfram.com/sites/13/2019/01/20-4-6.pdf',
                    },
                ],
            },
        ],
    ],
    [
        'Vol. 19',
        [
            {
                title: 'Vol. 19, No. 1',
                image: 'https://content.wolfram.com/sites/13/2018/02/19_1.gif',
                url: 'https://www.complex-systems.com/issues/19-1/',
                stories: [
                    {
                        name: 'Compression-Based Investigation of the Dynamical Properties of Cellular Automata and Other Systems',
                        pdf: 'https://content.wolfram.com/sites/13/2019/03/19-1-1.pdf',
                    },
                    {
                        name: 'Turing Machines with Two Letters and Two States',
                        pdf: 'https://content.wolfram.com/sites/13/2019/03/19-1-2.pdf',
                    },
                    {
                        name: 'From Sierpinski Carpets to Directed Graphs',
                        pdf: 'https://content.wolfram.com/sites/13/2019/03/19-1-3.pdf',
                    },
                    {
                        name: 'Dynamics of Algorithmic Processing in Computer Systems',
                        pdf: 'https://content.wolfram.com/sites/13/2019/03/19-1-4.pdf',
                    },
                    {
                        name: 'Linear Time Algorithm for Identifying the Invertibility of Null-Boundary Three Neighborhood Cellular Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2019/03/19-1-5.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 19, No. 2',
                image: 'https://content.wolfram.com/sites/13/2018/02/19_2.gif',
                url: 'https://www.complex-systems.com/issues/19-2/',
                stories: [
                    {
                        name: 'Dense Graphs, Node Sets, and Riders: Toward a Foundation for Particle Physics without Continuum Mathematics',
                        pdf: 'https://content.wolfram.com/sites/13/2019/03/19-2-1.pdf',
                    },
                    {
                        name: 'Emergent Properties of Discretized Wave Equations',
                        pdf: 'https://content.wolfram.com/sites/13/2019/03/19-2-2.pdf',
                    },
                    {
                        name: 'Particle Structures in Elementary Cellular Automaton Rule 146',
                        pdf: 'https://content.wolfram.com/sites/13/2019/03/19-2-3.pdf',
                    },
                    {
                        name: 'The Prototyping of a Shading Device Controlled by a Cellular Automaton',
                        pdf: 'https://content.wolfram.com/sites/13/2019/03/19-2-4.pdf',
                    },
                    {
                        name: 'Inducing Class 4 Behavior on the Basis of Lattice Analysis',
                        pdf: 'https://content.wolfram.com/sites/13/2019/03/19-2-5.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 19, No. 3',
                image: 'https://content.wolfram.com/sites/13/2018/02/19_3.gif',
                url: 'https://www.complex-systems.com/issues/19-3/',
                stories: [
                    {
                        name: 'Genetic Algorithm Search for Predictive Patterns in Multidimensional Time Series',
                        pdf: 'https://content.wolfram.com/sites/13/2019/03/19-3-1.pdf',
                    },
                    {
                        name: 'Changing the States of Abstract Discrete Systems',
                        pdf: 'https://content.wolfram.com/sites/13/2019/03/19-3-2.pdf',
                    },
                    {
                        name: 'A Real-World Spreading Experiment in the Blogosphere',
                        pdf: 'https://content.wolfram.com/sites/13/2019/03/19-3-3.pdf',
                    },
                    {
                        name: 'The Fixed String of Elementary Cellular Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2019/03/19-3-4.pdf',
                    },
                    {
                        name: 'Bit Copying: The Ultimate Computational Simplicity',
                        pdf: 'https://content.wolfram.com/sites/13/2019/03/19-3-5.pdf',
                    },
                    {
                        name: 'Robust Bidding in Learning Classifier Systems Using Loan and Bid History',
                        pdf: 'https://content.wolfram.com/sites/13/2019/03/19-3-6.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 19, No. 4',
                image: 'https://content.wolfram.com/sites/13/2018/02/19_4.gif',
                url: 'https://www.complex-systems.com/issues/19-4/',
                stories: [
                    {
                        name: 'A Model of City Traffic Based on Elementary Cellular Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2019/03/19-4-1.pdf',
                    },
                    {
                        name: 'Exact Calculation of Lyapunov Exponents and Spreading Rates for Rule 40',
                        pdf: 'https://content.wolfram.com/sites/13/2019/03/19-4-2.pdf',
                    },
                    {
                        name: 'Predicting Cellular Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2019/03/19-4-3.pdf',
                    },
                    {
                        name: "A Round-Robin Tournament of the Iterated Prisoner's Dilemma with Complete Memory-Size-Three Strategies",
                        pdf: 'https://content.wolfram.com/sites/13/2019/03/19-4-4.pdf',
                    },
                ],
            },
        ],
    ],
    [
        'Vol. 18',
        [
            {
                title: 'Vol. 18, No. 1',
                image: 'https://content.wolfram.com/sites/13/2018/02/18_1.gif',
                url: 'https://www.complex-systems.com/issues/18-1/',
                stories: [
                    {
                        name: 'Planar Trinet Dynamics with Two Rewrite Rules',
                        pdf: 'https://content.wolfram.com/sites/13/2019/03/18-1-1.pdf',
                    },
                    {
                        name: 'Basic Schemes for Reversible Two-Dimensional Cellular Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2019/03/18-1-2.pdf',
                    },
                    {
                        name: 'Reinventing Electronics with Cellular Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2019/03/18-1-3.pdf',
                    },
                    {
                        name: 'Effecting Semantic Network Bricolage via Infinite-Dimensional Zero-Divisor Ensembles',
                        pdf: 'https://content.wolfram.com/sites/13/2019/03/18-1-4.pdf',
                    },
                    {
                        name: 'Cellular Engineering',
                        pdf: 'https://content.wolfram.com/sites/13/2019/03/18-1-5.pdf',
                    },
                    {
                        name: 'How to Acknowledge Hypercomputation?',
                        pdf: 'https://content.wolfram.com/sites/13/2019/03/18-1-6.pdf',
                    },
                    {
                        name: 'Complexity and Universality of Iterated Finite Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2019/03/18-1-7.pdf',
                    },
                    {
                        name: 'Fire Feedbacks with Vegetation and Alternative Stable States',
                        pdf: 'https://content.wolfram.com/sites/13/2019/03/18-1-8.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 18, No. 2',
                image: 'https://content.wolfram.com/sites/13/2018/02/18_2.gif',
                url: 'https://www.complex-systems.com/issues/18-2/',
                stories: [
                    {
                        name: 'Breeding Diameter-Optimal Topologies for Distributed Indexes',
                        pdf: 'https://content.wolfram.com/sites/13/2019/03/18-2-1.pdf',
                    },
                    {
                        name: 'Elementary Cellular Automata with Minimal Memory and Random Number Generation',
                        pdf: 'https://content.wolfram.com/sites/13/2019/03/18-2-2.pdf',
                    },
                    {
                        name: 'Decremental Tag Systems and Random Trees',
                        pdf: 'https://content.wolfram.com/sites/13/2019/03/18-2-3.pdf',
                    },
                    {
                        name: 'Random Division and the Size Distribution of Business Firms',
                        pdf: 'https://content.wolfram.com/sites/13/2019/03/18-2-4.pdf',
                    },
                    {
                        name: 'The Entropy of Linear Cellular Automata with Respect to Any Bernoulli Measure',
                        pdf: 'https://content.wolfram.com/sites/13/2019/03/18-2-5.pdf',
                    },
                    {
                        name: 'Modeling Rope Reliability',
                        pdf: 'https://content.wolfram.com/sites/13/2019/03/18-2-6.pdf',
                    },
                    {
                        name: 'Influence of Excess 1|f Noise on Channel Capacity',
                        pdf: 'https://content.wolfram.com/sites/13/2019/03/18-2-7.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 18, No. 3',
                image: 'https://content.wolfram.com/sites/13/2018/02/18_3.gif',
                url: 'https://www.complex-systems.com/issues/18-3/',
                stories: [
                    {
                        name: 'Evaluating the Complexity of Mathematical Problems: Part 1',
                        pdf: 'https://content.wolfram.com/sites/13/2019/03/18-3-1.pdf',
                    },
                    {
                        name: 'Implementing Cellular Automata for Dynamically Shading a Building Facade',
                        pdf: 'https://content.wolfram.com/sites/13/2019/03/18-3-2.pdf',
                    },
                    {
                        name: 'An Algebraic and Graph Theoretic Framework to Study Monomial Dynamical Systems over a Finite Field',
                        pdf: 'https://content.wolfram.com/sites/13/2019/03/18-3-3.pdf',
                    },
                    {
                        name: 'Solving the Density Classification Task Using Cellular Automaton 184 with Memory',
                        pdf: 'https://content.wolfram.com/sites/13/2019/03/18-3-4.pdf',
                    },
                    {
                        name: 'Complex Dynamics Emerging in Rule 30 with Majority Memory',
                        pdf: 'https://content.wolfram.com/sites/13/2019/03/18-3-5.pdf',
                    },
                    {
                        name: 'Regularity versus Complexity in the Binary Representation of 3n',
                        pdf: 'https://content.wolfram.com/sites/13/2019/03/18-3-6.pdf',
                    },
                    {
                        name: 'Constrained Eden',
                        pdf: 'https://content.wolfram.com/sites/13/2019/03/18-3-7.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 18, No. 4',
                image: 'https://content.wolfram.com/sites/13/2018/02/18_4.gif',
                url: 'https://www.complex-systems.com/issues/18-4/',
                stories: [
                    {
                        name: 'Evaluating the Complexity of Mathematical Problems: Part 2',
                        pdf: 'https://content.wolfram.com/sites/13/2019/03/18-4-1.pdf',
                    },
                    {
                        name: 'Acceptable Complexity Measures of Theorems',
                        pdf: 'https://content.wolfram.com/sites/13/2019/03/18-4-2.pdf',
                    },
                    {
                        name: 'Persistent Structures in Elementary Cellular Automaton Rule 146',
                        pdf: 'https://content.wolfram.com/sites/13/2019/03/18-4-3.pdf',
                    },
                    {
                        name: 'A Glider for Every Graph: Exploring the Algorithmic Requirements for Rotationally Invariant, Straight-Line Motion',
                        pdf: 'https://content.wolfram.com/sites/13/2019/03/18-4-4.pdf',
                    },
                    {
                        name: 'Outer Median and Probabilistic Cellular Automata on Network Topologies',
                        pdf: 'https://content.wolfram.com/sites/13/2019/03/18-4-5.pdf',
                    },
                    {
                        name: '"Everything Is Everything" Revisited: Shapeshifting Data Types with Isomorphisms and Hylomorphisms',
                        pdf: 'https://content.wolfram.com/sites/13/2019/03/18-4-6.pdf',
                    },
                ],
            },
        ],
    ],
    [
        'Vol. 17',
        [
            {
                title: 'Vol. 17, No. 1',
                image: 'https://content.wolfram.com/sites/13/2018/02/17_1.gif',
                url: 'https://www.complex-systems.com/issues/17-1/',
                stories: [
                    {
                        name: 'A Structurally Dynamic Cellular Automaton with Memory in the Triangular Tessellation',
                        pdf: 'https://content.wolfram.com/sites/13/2023/02/17-1-1.pdf',
                    },
                    {
                        name: 'An NP-complete Problem for the Abelian Sandpile Model',
                        pdf: 'https://content.wolfram.com/sites/13/2023/02/17-1-2.pdf',
                    },
                    {
                        name: 'Recent Results on Ordering Parameters in Boolean Networks',
                        pdf: 'https://content.wolfram.com/sites/13/2023/02/17-1-3.pdf',
                    },
                    {
                        name: 'Simulation of Traffic Regulation and Cognitive Developmental Processes: Coupling Cellular Automata with Artificial Neural Nets',
                        pdf: 'https://content.wolfram.com/sites/13/2023/02/17-1-4.pdf',
                    },
                    {
                        name: 'Multi-physics Modeling Using Cellular Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2023/02/17-1-5.pdf',
                    },
                    {
                        name: 'Using Shape Grammar to Derive Cellular Automata Rule Patterns',
                        pdf: 'https://content.wolfram.com/sites/13/2023/02/17-1-6.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 17, No. 2',
                image: 'https://content.wolfram.com/sites/13/2018/02/17_2.gif',
                url: 'https://www.complex-systems.com/issues/17-2/',
                stories: [
                    {
                        name: 'Two-dimensional Four Color Cellular Automaton: Surface Explorations',
                        pdf: 'https://content.wolfram.com/sites/13/2023/02/17-2-1.pdf',
                    },
                    {
                        name: 'The Implications of ICT and NKS for Science Teaching: Whither Nigeria',
                        pdf: 'https://content.wolfram.com/sites/13/2023/02/17-2-2.pdf',
                    },
                    {
                        name: 'Placeholder Substructures I: The Road from NKS to Scale-Free Networks is Paved with Zero-Divisors',
                        pdf: 'https://content.wolfram.com/sites/13/2023/02/17-2-3.pdf',
                    },
                    {
                        name: 'Franklin Squares: A Chapter in the Scientific Studies of Magical Squares',
                        pdf: 'https://content.wolfram.com/sites/13/2023/02/17-2-4.pdf',
                    },
                    {
                        name: 'Two-dimensional Totalistic Code 52',
                        pdf: 'https://content.wolfram.com/sites/13/2023/02/17-2-5.pdf',
                    },
                    {
                        name: 'Eye-Tracking Study Using Cellular Automaton Patterns as Visual Stimuli: Implications for Current Models of Stimulus-Driven Selection Processes',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/17-2-6.pdf',
                    },
                    {
                        name: 'Novel Methods for Observing Economical Circulations',
                        pdf: 'https://content.wolfram.com/sites/13/2023/02/17-2-7.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 17, No. 3',
                image: 'https://content.wolfram.com/sites/13/2018/02/17_3.gif',
                url: 'https://www.complex-systems.com/issues/17-3/',
                stories: [
                    {
                        name: 'Cellular Automata with an Infinite Number of Subshift Attractors',
                        pdf: 'https://content.wolfram.com/sites/13/2023/02/17-3-1.pdf',
                    },
                    {
                        name: 'Research of Complexity in Cellular Automata through Evolutionary Algorithms',
                        pdf: 'https://content.wolfram.com/sites/13/2023/02/17-3-2.pdf',
                    },
                    {
                        name: 'Projectional Entropy in Higher Dimensional Shifts of Finite Type',
                        pdf: 'https://content.wolfram.com/sites/13/2023/02/17-3-3.pdf',
                    },
                    {
                        name: 'Evolutionary Reputation Games On Social Networks',
                        pdf: 'https://content.wolfram.com/sites/13/2023/02/17-3-4.pdf',
                    },
                    {
                        name: 'Segmentation and Context of Literary and Musical Sequences',
                        pdf: 'https://content.wolfram.com/sites/13/2023/02/17-3-5.pdf',
                    },
                    {
                        name: "Chaotic Properties of the Elementary Cellular Automaton Rule 40 in Wolfram's Class I",
                        pdf: 'https://content.wolfram.com/sites/13/2023/02/17-3-6.pdf',
                    },
                    {
                        name: 'Topologies and Centralities of Replied Networks on Bulletin Board Systems',
                        pdf: 'https://content.wolfram.com/sites/13/2023/02/17-3-7.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 17, No. 4',
                image: 'https://content.wolfram.com/sites/13/2018/02/17_4.gif',
                url: 'https://www.complex-systems.com/issues/17-4/',
                stories: [
                    {
                        name: 'Evolutionary Search for Cellular Automata Logic Gates with Collision-Based Computing',
                        pdf: 'https://content.wolfram.com/sites/13/2023/02/17-4-1.pdf',
                    },
                    {
                        name: 'Relative Referenced Genetic Programming',
                        pdf: 'https://content.wolfram.com/sites/13/2023/02/17-4-2.pdf',
                    },
                    {
                        name: 'Dynamics of Directed Boolean Networks under Generalized Elementary Cellular Automata Rules, with Power-Law Distributions and Popularity Assignment of Parent Nodes',
                        pdf: 'https://content.wolfram.com/sites/13/2023/02/17-4-3.pdf',
                    },
                    {
                        name: 'Visualizing the Repeat Structure of Genomic Sequences',
                        pdf: 'https://content.wolfram.com/sites/13/2023/02/17-4-4.pdf',
                    },
                    {
                        name: 'Power Spectral Analysis of Elementary Cellular Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2023/02/17-4-5.pdf',
                    },
                    {
                        name: 'Empirical Evidence of Some Stylized Facts in International Crude Oil Markets',
                        pdf: 'https://content.wolfram.com/sites/13/2023/02/17-4-6.pdf',
                    },
                    {
                        name: 'Agent-Based Simulation of N-Person Games with Crossing Payoff Functions',
                        pdf: 'https://content.wolfram.com/sites/13/2023/02/17-4-7.pdf',
                    },
                ],
            },
        ],
    ],
    [
        'Vol. 16',
        [
            {
                title: 'Vol. 16, No. 1',
                image: 'https://content.wolfram.com/sites/13/2018/02/16_1.gif',
                url: 'https://www.complex-systems.com/issues/16-1/',
                stories: [
                    {
                        name: 'An Experimental Study of Robustness to Asynchronism for Elementary Cellular Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2023/02/16-1-1.pdf',
                    },
                    {
                        name: 'Self-organizing Traffic Lights',
                        pdf: 'https://content.wolfram.com/sites/13/2023/02/16-1-2.pdf',
                    },
                    {
                        name: 'The NQK Model of Fitness Dynamics: Adaptation by Selective Elimination and Random Replacements',
                        pdf: 'https://content.wolfram.com/sites/13/2023/02/16-1-3.pdf',
                    },
                    {
                        name: 'Complex Network Metrology',
                        pdf: 'https://content.wolfram.com/sites/13/2023/02/16-1-4.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 16, No. 2',
                image: 'https://content.wolfram.com/sites/13/2018/02/16_2.gif',
                url: 'https://www.complex-systems.com/issues/16-2/',
                stories: [
                    {
                        name: 'Stochastic Self-organization',
                        pdf: 'https://content.wolfram.com/sites/13/2023/02/16-2-1.pdf',
                    },
                    {
                        name: 'Dynamics of the Cellular Automaton Rule 142',
                        pdf: 'https://content.wolfram.com/sites/13/2023/02/16-2-2.pdf',
                    },
                    {
                        name: 'Estimating Transient Surface Heating using a Cellular Automaton Energy-transport Model',
                        pdf: 'https://content.wolfram.com/sites/13/2023/02/16-2-3.pdf',
                    },
                    {
                        name: 'Computable Information Content and Boolean Networks Dynamics',
                        pdf: 'https://content.wolfram.com/sites/13/2023/02/16-2-4.pdf',
                    },
                    {
                        name: 'Field Theoretical Approach to the Conservation of Identity of a Complex Network System',
                        pdf: 'https://content.wolfram.com/sites/13/2023/02/16-2-5.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 16, No. 3',
                image: 'https://content.wolfram.com/sites/13/2018/02/16_3.gif',
                url: 'https://www.complex-systems.com/issues/16-3/',
                stories: [
                    {
                        name: 'Fractal Replication in Time-manipulated One-dimensional Cellular Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2023/02/16-3-1.pdf',
                    },
                    {
                        name: 'Dynamics of a Time-outs Management System',
                        pdf: 'https://content.wolfram.com/sites/13/2023/02/16-3-2.pdf',
                    },
                    {
                        name: 'Locus-Shift Operator for Function Optimization in Genetic Algorithms',
                        pdf: 'https://content.wolfram.com/sites/13/2023/02/16-3-3.pdf',
                    },
                    {
                        name: 'Local Nested Structure in Rule 30',
                        pdf: 'https://content.wolfram.com/sites/13/2023/02/16-3-4.pdf',
                    },
                    {
                        name: 'Infection and Atherosclerosis: Is There an Association?',
                        pdf: 'https://content.wolfram.com/sites/13/2023/02/16-3-5.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 16, No. 4',
                image: 'https://content.wolfram.com/sites/13/2018/02/16_4.gif',
                url: 'https://www.complex-systems.com/issues/16-4/',
                stories: [
                    {
                        name: 'Computing in Spiral Rule Reaction-Diffusion Hexagonal Cellular Automaton',
                        pdf: 'https://content.wolfram.com/sites/13/2023/02/16-4-1.pdf',
                    },
                    {
                        name: 'Distributed Dynamical Omnicast Routing',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/16-4-2.pdf',
                    },
                    {
                        name: 'Fitness Landscape Analysis and Optimization of Coupled Oscillators',
                        pdf: 'https://content.wolfram.com/sites/13/2023/02/16-4-3.pdf',
                    },
                    {
                        name: 'Monomial Dynamical Systems over Finite Fields',
                        pdf: 'https://content.wolfram.com/sites/13/2023/02/16-4-4.pdf',
                    },
                    {
                        name: 'A Complex System Model of Glucose Regulatory Metabolism',
                        pdf: 'https://content.wolfram.com/sites/13/2023/02/16-4-5.pdf',
                    },
                    {
                        name: 'Synchronization in Electrically Coupled Neural Networks',
                        pdf: 'https://content.wolfram.com/sites/13/2023/02/16-4-6.pdf',
                    },
                    {
                        name: 'A Note About the Discovery of Many New Rules for the Game of Three-Dimensional Life',
                        pdf: 'https://content.wolfram.com/sites/13/2023/02/16-4-7.pdf',
                    },
                ],
            },
        ],
    ],
    [
        'Vol. 15',
        [
            {
                title: 'Vol. 15, No. 1',
                image: 'https://content.wolfram.com/sites/13/2018/02/15_1.gif',
                url: 'https://www.complex-systems.com/issues/15-1/',
                stories: [
                    {
                        name: 'Universality in Elementary Cellular Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2023/02/15-1-1.pdf',
                    },
                    {
                        name: 'Point Mutations and Transitions Between Cellular Automata Attractor Basins',
                        pdf: 'https://content.wolfram.com/sites/13/2023/02/15-1-2.pdf',
                    },
                    {
                        name: 'Exponential Period of Neuronal Recurrence Automata with Excitatory Memory',
                        pdf: 'https://content.wolfram.com/sites/13/2023/02/15-1-3.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 15, No. 2',
                image: 'https://content.wolfram.com/sites/13/2018/02/15_2.gif',
                url: 'https://www.complex-systems.com/issues/15-2/',
                stories: [
                    {
                        name: 'Permutation Numbers',
                        pdf: 'https://content.wolfram.com/sites/13/2023/02/15-2-1.pdf',
                    },
                    {
                        name: 'The Evolution Homomorphism and Permutation Actions on Group Generated Cellular Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2023/02/15-2-2.pdf',
                    },
                    {
                        name: 'A Small-world Network Where All Nodes Have the Same Connectivity, with Application to the Dynamics of Boolean Interacting Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2023/02/15-2-3.pdf',
                    },
                    {
                        name: 'Swarm-Mediated Cluster-Based Construction',
                        pdf: 'https://content.wolfram.com/sites/13/2023/02/15-2-4.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 15, No. 3',
                image: 'https://content.wolfram.com/sites/13/2018/02/15_3.gif',
                url: 'https://www.complex-systems.com/issues/15-3/',
                stories: [
                    {
                        name: 'Evolving Distributed Control for an Object Clustering Task',
                        pdf: 'https://content.wolfram.com/sites/13/2023/02/15-3-1.pdf',
                    },
                    {
                        name: 'One-dimensional Cellular Automata with Memory in Cells of the Most Frequent Recent Value',
                        pdf: 'https://content.wolfram.com/sites/13/2023/02/15-3-2.pdf',
                    },
                    {
                        name: 'n-Skip Turing Machines',
                        pdf: 'https://content.wolfram.com/sites/13/2023/02/15-3-3.pdf',
                    },
                    {
                        name: 'A Note on the Game of Life in Hexagonal and Pentagonal Tessellations',
                        pdf: 'https://content.wolfram.com/sites/13/2023/02/15-3-4.pdf',
                    },
                    {
                        name: 'Classification of Different Indian Songs Based on Fractal Analysis',
                        pdf: 'https://content.wolfram.com/sites/13/2023/02/15-3-5.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 15, No. 4',
                image: 'https://content.wolfram.com/sites/13/2018/02/15_4.gif',
                url: 'https://www.complex-systems.com/issues/15-4/',
                stories: [
                    {
                        name: 'Evolution and Dynamics of Small-World Cellular Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2023/02/15-4-1.pdf',
                    },
                    {
                        name: 'Repeated Sequences in Linear Genetic Programming Genomes',
                        pdf: 'https://content.wolfram.com/sites/13/2023/02/15-4-2.pdf',
                    },
                    {
                        name: 'Local and Global Evaluation Functions for Computational Evolution',
                        pdf: 'https://content.wolfram.com/sites/13/2023/02/15-4-3.pdf',
                    },
                    {
                        name: 'Detailed Analysis of Uphill Moves in Temperature Parallel Simulated Annealing and Enhancement of Exchange Probabilities',
                        pdf: 'https://content.wolfram.com/sites/13/2023/02/15-4-4.pdf',
                    },
                ],
            },
        ],
    ],
    [
        'Vol. 14',
        [
            {
                title: 'Vol. 14, No. 1',
                image: 'https://content.wolfram.com/sites/13/2018/02/14_1.gif',
                url: 'https://www.complex-systems.com/issues/14-1/',
                stories: [
                    {
                        name: 'Static and Dynamic Properties of Small-world Connection Topologies Based on Transit-stub Networks',
                        pdf: 'https://content.wolfram.com/sites/13/2023/02/14-1-1.pdf',
                    },
                    {
                        name: 'Sequences of Preimages in Elementary Cellular Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2023/02/14-1-2.pdf',
                    },
                    {
                        name: 'Emergent Properties of Feedback Regulation and Stem Cell Behavior in a Granulopoiesis Model as a Complex System',
                        pdf: 'https://content.wolfram.com/sites/13/2023/02/14-1-3.pdf',
                    },
                    {
                        name: 'Using Statistical Learning Theory to Rationalize System Model Identification and Validation Part I: Mathematical Foundations',
                        pdf: 'https://content.wolfram.com/sites/13/2023/02/14-1-4.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 14, No. 2',
                image: 'https://content.wolfram.com/sites/13/2018/02/14_2.gif',
                url: 'https://www.complex-systems.com/issues/14-2/',
                stories: [
                    {
                        name: 'Elementary Cellular Automata with Memory',
                        pdf: 'https://content.wolfram.com/sites/13/2023/02/14-2-1.pdf',
                    },
                    {
                        name: 'Progressive Feature Extraction with a Greedy Network-growing Algorithm',
                        pdf: 'https://content.wolfram.com/sites/13/2023/02/14-2-2.pdf',
                    },
                    {
                        name: "An Investigation of N-person Prisoners' Dilemmas",
                        pdf: 'https://content.wolfram.com/sites/13/2023/02/14-2-3.pdf',
                    },
                    {
                        name: 'Translations of Cellular Automata for Efficient Simulation',
                        pdf: 'https://content.wolfram.com/sites/13/2023/02/14-2-4.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 14, No. 3',
                image: 'https://content.wolfram.com/sites/13/2018/02/14_3.gif',
                url: 'https://www.complex-systems.com/issues/14-3/',
                stories: [
                    {
                        name: 'Increase of Complexity from Classical Greek to Latin Poetry',
                        pdf: 'https://content.wolfram.com/sites/13/2023/02/14-3-1.pdf',
                    },
                    {
                        name: 'Redundancy Attributes of a Complex System: Application to Bioinformatics',
                        pdf: 'https://content.wolfram.com/sites/13/2023/02/14-3-2.pdf',
                    },
                    {
                        name: 'Emergent Model Based On Hybrid Rough Sets Systems',
                        pdf: 'https://content.wolfram.com/sites/13/2023/02/14-3-3.pdf',
                    },
                    {
                        name: "Definition and Behavior of Langton's Ant in Three Dimensions",
                        pdf: 'https://content.wolfram.com/sites/13/2023/02/14-3-4.pdf',
                    },
                    {
                        name: 'Read Before You Cite!',
                        pdf: 'https://content.wolfram.com/sites/13/2023/02/14-3-5.pdf',
                    },
                    {
                        name: 'Creating Large Life Forms with Interactive Life',
                        pdf: 'https://content.wolfram.com/sites/13/2023/02/14-3-6.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 14, No. 4',
                image: 'https://content.wolfram.com/sites/13/2018/02/14_4.gif',
                url: 'https://www.complex-systems.com/issues/14-4/',
                stories: [
                    {
                        name: 'A Comparison of Several Linear Genetic Programming Techniques',
                        pdf: 'https://content.wolfram.com/sites/13/2023/02/14-4-1.pdf',
                    },
                    {
                        name: 'A Distributed Learning Algorithm for Communication Development',
                        pdf: 'https://content.wolfram.com/sites/13/2023/02/14-4-2.pdf',
                    },
                    {
                        name: 'From Collective Mind to Communication',
                        pdf: 'https://content.wolfram.com/sites/13/2023/02/14-4-3.pdf',
                    },
                    {
                        name: 'El Botellön: Modeling the Movement of Crowds in a City',
                        pdf: 'https://content.wolfram.com/sites/13/2023/02/14-4-4.pdf',
                    },
                ],
            },
        ],
    ],
    [
        'Vol. 13',
        [
            {
                title: 'Vol. 13, No. 1',
                image: 'https://content.wolfram.com/sites/13/2018/02/13_1.gif',
                url: 'https://www.complex-systems.com/issues/13-1/',
                stories: [
                    {
                        name: 'Computation in Gene Expression',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/13-1-1.pdf',
                    },
                    {
                        name: 'A Striking Property of Genetic Code-like Transformations',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/13-1-2.pdf',
                    },
                    {
                        name: 'A Model of Gene Expression and Regulation in an Artificial Cellular Organism',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/13-1-3.pdf',
                    },
                    {
                        name: 'Temporal Boolean Network Models of Genetic Networks and their Inference from Gene Expression Time Series',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/13-1-4.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 13, No. 2',
                image: 'https://content.wolfram.com/sites/13/2018/02/13_2.gif',
                url: 'https://www.complex-systems.com/issues/13-2/',
                stories: [
                    {
                        name: 'Gene Expression Programming: A New Adaptive Algorithm for Solving Problems',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/13-2-1.pdf',
                    },
                    {
                        name: 'The Relationship between One-dimensional Continuous  Cellular Automata and One-dimensional Nonlinear Dynamical Systems',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/13-2-2.pdf',
                    },
                    {
                        name: 'Deterministic Site Exchange Cellular Automata Models for the Spread of Diseases in Human Settlements',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/13-2-3.pdf',
                    },
                    {
                        name: 'Structure Design of Neural Networks Using Genetic Algorithms',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/13-2-4.pdf',
                    },
                    {
                        name: 'Estimation of Multivariate Cumulative Processes',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/13-2-5.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 13, No. 3',
                image: 'https://content.wolfram.com/sites/13/2018/02/13_3.gif',
                url: 'https://www.complex-systems.com/issues/13-3/',
                stories: [
                    {
                        name: 'Evolving Robust Asynchronous Cellular Automata for the Density Task',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/13-3-1.pdf',
                    },
                    {
                        name: 'Optimization of the Memory Weighting Function in Stochastic Functional Self-Organized Sorting Performed by a Team of Autonomous Mobile Agents',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/13-3-2.pdf',
                    },
                    {
                        name: 'Dynamic Neighborhood Structures in Parallel Evolution Strategies',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/13-3-3.pdf',
                    },
                    {
                        name: 'Decomposition of Additive Cellular Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/13-3-4.pdf',
                    },
                    {
                        name: 'Evolution Complexity of the Elementary Cellular Automaton Rule 18',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/13-3-5.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 13, No. 4',
                image: 'https://content.wolfram.com/sites/13/2018/02/13_4.gif',
                url: 'https://www.complex-systems.com/issues/13-4/',
                stories: [
                    {
                        name: 'Memetic Algorithms for the Traveling Salesman Problem',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/13-4-1.pdf',
                    },
                    {
                        name: 'Differential Equations and Cellular Automata Models of the Growth of Cell Cultures and Transformation Foci',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/13-4-2.pdf',
                    },
                    {
                        name: 'Recursive Binary Sequences of Differences',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/13-4-3.pdf',
                    },
                    {
                        name: 'Bridging Complexity and Ecology: An Outline of Health Ecology',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/13-4-4.pdf',
                    },
                ],
            },
        ],
    ],
    [
        'Vol. 12',
        [
            {
                title: 'Vol. 12, No. 1',
                image: 'https://content.wolfram.com/sites/13/2018/02/12_1.gif',
                url: 'https://www.complex-systems.com/issues/12-1/',
                stories: [
                    {
                        name: 'Genetic Algorithms: From Hegemony to Chaos',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/12-1-1.pdf',
                    },
                    {
                        name: 'A Complex System Characterization of Modern Telecommunication Services',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/12-1-2.pdf',
                    },
                    {
                        name: 'Nonuniform Cellular Automata for Cryptography',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/12-1-3.pdf',
                    },
                    {
                        name: 'The Enumeration of Preimages and Gardens-of-Eden in Sequential Cellular Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/12-1-4.pdf',
                    },
                    {
                        name: 'A Geometric Model of Information Retrieval Systems',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/12-1-5.pdf',
                    },
                    {
                        name: 'Self-regulation in a Simple Model of Hierarchically Organized Markets',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/12-1-6.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 12, No. 2',
                image: 'https://content.wolfram.com/sites/13/2018/02/12_2.gif',
                url: 'https://www.complex-systems.com/issues/12-2/',
                stories: [
                    {
                        name: 'Apparent Entropy of Cellular Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/12-2-1.pdf',
                    },
                    {
                        name: 'Punctuated Equilibria in Simple Genetic Algorithms for Functions of Unitation',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/12-2-2.pdf',
                    },
                    {
                        name: 'Finite Population Effects for Ranking and Tournament Selection',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/12-2-3.pdf',
                    },
                    {
                        name: 'Multiscaling in Expansion-modification Systems: An Explanation for Long Range Correlation in DNA',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/12-2-4.pdf',
                    },
                    {
                        name: 'Measuring Mutual Information in Random Boolean Networks',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/12-2-5.pdf',
                    },
                    {
                        name: 'A Single Nonexpansive, Nonperiodic Rational Direction',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/12-2-6.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 12, No. 3',
                image: 'https://content.wolfram.com/sites/13/2018/02/12_3.gif',
                url: 'https://www.complex-systems.com/issues/12-3/',
                stories: [
                    {
                        name: 'Protein Evolution as a Parallel-distributed Process: A Novel Approach to Evolutionary Modeling and Protein Design',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/12-3-1.pdf',
                    },
                    {
                        name: 'A Relative Complexity Metric for Decision-theoretic Applications in Complex Systems',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/12-3-2.pdf',
                    },
                    {
                        name: 'Chaos and Predictability of Internet Transmission Times',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/12-3-3.pdf',
                    },
                    {
                        name: 'Nuclear Weapon Pits: Burn Them or Bury Them? A Richardsonian Energy Competition Decision Model',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/12-3-4.pdf',
                    },
                    {
                        name: 'On Markov Chains, Attractors, and Neural Nets',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/12-3-5.pdf',
                    },
                    {
                        name: 'Function and Form in Networks of Interacting Agents',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/12-3-6.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 12, No. 4',
                image: 'https://content.wolfram.com/sites/13/2018/02/12_4.gif',
                url: 'https://www.complex-systems.com/issues/12-4/',
                stories: [
                    {
                        name: 'Cyclic Evolution of Neuronal Automata with Memory When All the Weighting Coefficients are Strictly Positive',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/12-4-1.pdf',
                    },
                    {
                        name: 'No Polynomial Bound for the Period of Neuronal Automata with Inhibitory Memory',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/12-4-2.pdf',
                    },
                    {
                        name: 'Universal Field Machine that Computes Beyond the Turing Limit',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/12-4-3.pdf',
                    },
                    {
                        name: 'Swarm-like Dynamics and their Use in Organization and Management',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/12-4-4.pdf',
                    },
                    {
                        name: 'On the Expected Performance of Systems with Complex Interactions Among Components',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/12-4-5.pdf',
                    },
                    {
                        name: 'Circulation Transport Phenomena Involving the Interaction between Arterial and Venous Vessel Systems Based on a Simulation Using Fractal Properties',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/12-4-6.pdf',
                    },
                    {
                        name: 'Analyzing the Population Based Incremental Learning Algorithm by Means of Discrete Dynamical Systems',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/12-4-7.pdf',
                    },
                    {
                        name: 'Erratum for: On Markov Chains, Attractors, and Neural Nets',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/12-4-8.pdf',
                    },
                ],
            },
        ],
    ],
    [
        'Vol. 11',
        [
            {
                title: 'Vol. 11, No. 1',
                image: 'https://content.wolfram.com/sites/13/2018/02/11_1.gif',
                url: 'https://www.complex-systems.com/issues/11-1/',
                stories: [
                    {
                        name: 'Controlling -entropy with a Neural -Feature Detector',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/11-1-1.pdf',
                    },
                    {
                        name: 'A Cellular Automata Model of Soil Bioremediation',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/11-1-2.pdf',
                    },
                    {
                        name: 'Commuting Cellular Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/11-1-3.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 11, No. 2',
                image: 'https://content.wolfram.com/sites/13/2018/02/11_2.gif',
                url: 'https://www.complex-systems.com/issues/11-2/',
                stories: [
                    {
                        name: 'Learning Decentralized Goal-based Vector Quantization',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/11-2-1.pdf',
                    },
                    {
                        name: 'Cellular Automata in the Cantor, Besicovitch, and Weyl Topological Spaces',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/11-2-2.pdf',
                    },
                    {
                        name: 'Symmetrization of Information-theoretic Error-measures Applied to Artificial Neural Network Training',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/11-2-3.pdf',
                    },
                    {
                        name: 'Formula Processing on Physical Systems by Symmetry',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/11-2-4.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 11, No. 3',
                image: 'https://content.wolfram.com/sites/13/2018/02/11_3.gif',
                url: 'https://www.complex-systems.com/issues/11-3/',
                stories: [
                    {
                        name: 'A Dynamical Systems Model for Language Change',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/11-3-1.pdf',
                    },
                    {
                        name: 'A Characterization of Hard-threshold Boolean Functions',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/11-3-2.pdf',
                    },
                    {
                        name: 'Chaotic Properties of the Q-state Potts Model on the Bethe Lattice: Q < 2',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/11-3-3.pdf',
                    },
                    {
                        name: 'Protection of Information in Quantum Databases',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/11-3-4.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 11, No. 4',
                image: 'https://content.wolfram.com/sites/13/2018/02/11_4.gif',
                url: 'https://www.complex-systems.com/issues/11-4/',
                stories: [
                    {
                        name: 'SEARCH, Computational Processes in Evolution, and Preliminary Development of the Gene Expression Messy Genetic Algorithm',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/11-4-1.pdf',
                    },
                    {
                        name: 'Maximum Entropy: A Special Case of Minimum Cross-entropy Applied to Nonlinear Estimation by an Artificial Neural Network',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/11-4-2.pdf',
                    },
                    {
                        name: 'Noise Induced Phase Transition in a Two-dimensional Coupled Map Lattice',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/11-4-3.pdf',
                    },
                    {
                        name: 'Parametric S-tree Method and Its Generalizations',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/11-4-4.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 11, No. 5',
                image: 'https://content.wolfram.com/sites/13/2018/02/11_5.gif',
                url: 'https://www.complex-systems.com/issues/11-5/',
                stories: [
                    {
                        name: 'A Method for Estimating Mean First-passage Time in Genetic Algorithms',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/11-5-1.pdf',
                    },
                    {
                        name: 'Distributed Self-regulation in Ecological and Economic Systems',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/11-5-2.pdf',
                    },
                    {
                        name: 'Some Parameters Characterizing Cellular Automata Rules',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/11-5-3.pdf',
                    },
                    {
                        name: 'A New Algorithmic Approach to the Minority Game',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/11-5-4.pdf',
                    },
                    {
                        name: 'A Model for the Evolution of Society Based on the Principles of Communicative Links Formation',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/11-5-5.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 11, No. 6',
                image: 'https://content.wolfram.com/sites/13/2018/02/11_6.gif',
                url: 'https://www.complex-systems.com/issues/11-6/',
                stories: [
                    {
                        name: 'Complexity Classes in the Two-dimensional Life Cellular Automata Subspace',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/11-6-1.pdf',
                    },
                    {
                        name: 'The Dynamics of a Genetic Algorithm on a Model Hard Optimization Problem',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/11-6-2.pdf',
                    },
                    {
                        name: 'Speedup of Iterated Quantum Search by Parallel Performance',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/11-6-3.pdf',
                    },
                    {
                        name: 'Citations and the Zipf--Mandelbrot Law',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/11-6-4.pdf',
                    },
                    {
                        name: 'Studying Social Complexity: From Soft to Virtual Systems Methodology',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/11-6-5.pdf',
                    },
                ],
            },
        ],
    ],
    [
        'Vol. 10',
        [
            {
                title: 'Vol. 10, No. 1',
                image: 'https://content.wolfram.com/sites/13/2018/02/10_1.gif',
                url: 'https://www.complex-systems.com/issues/10-1/',
                stories: [
                    {
                        name: 'When Can Solitons Compute?',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/10-1-1.pdf',
                    },
                    {
                        name: 'PECANS: A Parallel Environment for Cellular Automata Modeling',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/10-1-2.pdf',
                    },
                    {
                        name: 'A Symbolic Way to Express Paths and Orbits of Two Iterated Function Systems',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/10-1-3.pdf',
                    },
                    {
                        name: 'Information-theoretic Aspects of Neural Stochastic Resonance',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/10-1-4.pdf',
                    },
                    {
                        name: 'An Immune Network Approach to Sensor-based Diagnosis by Self-organization',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/10-1-5.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 10, No. 2',
                image: 'https://content.wolfram.com/sites/13/2018/02/10_2.gif',
                url: 'https://www.complex-systems.com/issues/10-2/',
                stories: [
                    {
                        name: 'Continuous-valued Cellular Automata for Nonlinear Wave Equations',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/10-2-1.pdf',
                    },
                    {
                        name: '-Automata on Square Grids',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/10-2-2.pdf',
                    },
                    {
                        name: 'Information-theoretic Analysis of Phase Transitions',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/10-2-3.pdf',
                    },
                    {
                        name: 'The Complexity of Computations in Recurrent Boolean Networks',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/10-2-4.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 10, No. 3',
                image: 'https://content.wolfram.com/sites/13/2018/02/10_3.gif',
                url: 'https://www.complex-systems.com/issues/10-3/',
                stories: [
                    {
                        name: 'Theoretical Analysis of Genetic Algorithms with Infinite Population Size',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/10-3-1.pdf',
                    },
                    {
                        name: 'Algebraic Properties of the Block Transformation on Cellular Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/10-3-2.pdf',
                    },
                    {
                        name: 'Grain Sorting in the One-dimensional Sand Pile Model',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/10-3-3.pdf',
                    },
                    {
                        name: 'Computation of Predecessor States for Composite Elementary Cellular Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/10-3-4.pdf',
                    },
                    {
                        name: 'Complexity Growth in Almost Periodic Fluids in the Case of Lattice Gas Cellular Automata and Vlasov Systems',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/10-3-5.pdf',
                    },
                    {
                        name: 'Evolving Parallel Computation',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/10-3-6.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 10, No. 4',
                image: 'https://content.wolfram.com/sites/13/2018/02/10_4.gif',
                url: 'https://www.complex-systems.com/issues/10-4/',
                stories: [
                    {
                        name: 'Synchronization of One-way Connected Processors',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/10-4-1.pdf',
                    },
                    {
                        name: 'Replicability of Neural Computing Experiments',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/10-4-2.pdf',
                    },
                    {
                        name: 'Language Complexity of Unimodal Systems',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/10-4-3.pdf',
                    },
                    {
                        name: 'Breakdown Processes of Conservative Systems',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/10-4-4.pdf',
                    },
                    {
                        name: 'Convergence in Simulated Evolution Algorithms',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/10-4-5.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 10, No. 5',
                image: 'https://content.wolfram.com/sites/13/2018/02/10_5.gif',
                url: 'https://www.complex-systems.com/issues/10-5/',
                stories: [
                    {
                        name: 'Self-similarity and Fine Structures in the Linear-logistic Map',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/10-5-1.pdf',
                    },
                    {
                        name: "Application of Eigen's Evolution Model to Infinite Population Genetic Algorithms with Selection and Mutation",
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/10-5-2.pdf',
                    },
                    {
                        name: 'A New Candidate Rule for the Game of Two-dimensional Life',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/10-5-3.pdf',
                    },
                    {
                        name: 'Cellular Automata and Continuous Functions: Negative Results',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/10-5-4.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 10, No. 6',
                image: 'https://content.wolfram.com/sites/13/2018/02/10_6.gif',
                url: 'https://www.complex-systems.com/issues/10-6/',
                stories: [
                    {
                        name: 'On Classes of One-dimensional Self-assembling Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/10-6-1.pdf',
                    },
                    {
                        name: 'A General Discrete Velocity Model Including Internal Degrees of Freedom',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/10-6-2.pdf',
                    },
                    {
                        name: 'Life Without Death is P-complete',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/10-6-3.pdf',
                    },
                    {
                        name: 'Solving a Dynamic Traveling Salesman Problem with an Adaptive Hopfield Network',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/10-6-4.pdf',
                    },
                ],
            },
        ],
    ],
    [
        'Vol. 9',
        [
            {
                title: 'Vol. 9, No. 1',
                image: 'https://content.wolfram.com/sites/13/2018/02/9_1.gif',
                url: 'https://www.complex-systems.com/issues/09-1/',
                stories: [
                    {
                        name: 'Sequences of Pseudorandom Numbers with Arbitrarily Large Periods',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/09-1-1.pdf',
                    },
                    {
                        name: 'Nonbinary Transforms for Genetic Algorithm Problems',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/09-1-2.pdf',
                    },
                    {
                        name: 'Signal Flow Graphs as an Efficient Tool for Gradient and Exact Hessian Determination',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/09-1-3.pdf',
                    },
                    {
                        name: 'Adaptively Resizing Populations: Algorithm, Analysis, and First Results',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/09-1-4.pdf',
                    },
                    {
                        name: 'Distinct Excluded Blocks and Grammatical Complexity of Dynamical Systems',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/09-1-5.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 9, No. 2',
                image: 'https://content.wolfram.com/sites/13/2018/02/9_2.gif',
                url: 'https://www.complex-systems.com/issues/09-2/',
                stories: [
                    {
                        name: 'The HeartQuake Dynamic System',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/09-2-1.pdf',
                    },
                    {
                        name: 'Simulated Binary Crossover for Continuous Search Space',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/09-2-2.pdf',
                    },
                    {
                        name: 'Staggered Invariants in Cellular Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/09-2-3.pdf',
                    },
                    {
                        name: 'A Generalization of Cellular Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/09-2-4.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 9, No. 3',
                image: 'https://content.wolfram.com/sites/13/2018/02/9_3.gif',
                url: 'https://www.complex-systems.com/issues/09-3/',
                stories: [
                    {
                        name: 'A Generalized Crossover Operation for Genetic Algorithms',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/09-3-1.pdf',
                    },
                    {
                        name: 'Genetic Algorithms, Tournament Selection, and the Effects of Noise',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/09-3-2.pdf',
                    },
                    {
                        name: 'The Dynamics of a Genetic Algorithm under Stabilizing Selection',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/09-3-3.pdf',
                    },
                    {
                        name: 'Some Results on Invertible Cellular Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/09-3-4.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 9, No. 4',
                image: 'https://content.wolfram.com/sites/13/2018/02/9_4.gif',
                url: 'https://www.complex-systems.com/issues/09-4/',
                stories: [
                    {
                        name: 'Global Cellular Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/09-4-1.pdf',
                    },
                    {
                        name: 'A Central Limit Theorem for the Population Process of Genetic Algorithms',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/09-4-2.pdf',
                    },
                    {
                        name: 'Information-Theoretic Based Error-Metrics for Gradient Descent Learning in Neural Networks',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/09-4-3.pdf',
                    },
                    {
                        name: 'A Temporal Sequence Processor Based on the Biological Reaction-diffusion Process',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/09-4-4.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 9, No. 5',
                image: 'https://content.wolfram.com/sites/13/2018/02/9_5.gif',
                url: 'https://www.complex-systems.com/issues/09-5/',
                stories: [
                    {
                        name: 'One-dimensional Deterministic Greenberg--Hastings Models',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/09-5-1.pdf',
                    },
                    {
                        name: 'Dynamic Properties of Neural Learning in the Information-theoretic Plane',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/09-5-2.pdf',
                    },
                    {
                        name: 'Mixed IFS: Resolution of the Inverse Problem using Genetic Programming',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/09-5-3.pdf',
                    },
                    {
                        name: 'Additive Cellular Automata with External Inputs',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/09-5-4.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 9, No. 6',
                image: 'https://content.wolfram.com/sites/13/2018/02/9_6.gif',
                url: 'https://www.complex-systems.com/issues/09-6/',
                stories: [
                    {
                        name: 'Real-coded Genetic Algorithms with Simulated Binary Crossover: Studies on Multimodal and Multiobjective Problems',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/09-6-1.pdf',
                    },
                    {
                        name: 'Bilinear Cellular Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/09-6-2.pdf',
                    },
                    {
                        name: 'Misspecifying GARCH-M Processes',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/09-6-3.pdf',
                    },
                    {
                        name: 'Cellular Automata and Nonperiodic Orbits',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/09-6-4.pdf',
                    },
                ],
            },
        ],
    ],
    [
        'Vol. 8',
        [
            {
                title: 'Vol. 8, No. 1',
                image: 'https://content.wolfram.com/sites/13/2018/02/8_1.gif',
                url: 'https://www.complex-systems.com/issues/08-1/',
                stories: [
                    {
                        name: 'Covers: A Theory of Boolean Function Decomposition',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/08-1-1.pdf',
                    },
                    {
                        name: 'Analysis and Forecasting of Time Series by Averaged Scalar Products of Flow Vectors',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/08-1-2.pdf',
                    },
                    {
                        name: 'Hyperplane Dynamics as a Means to Understanding Back-Propagation Learning and Network Plasticity',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/08-1-3.pdf',
                    },
                    {
                        name: 'Further Notes on the Game of Three-Dimensional Life',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/08-1-4.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 8, No. 2',
                image: 'https://content.wolfram.com/sites/13/2018/02/8_2.gif',
                url: 'https://www.complex-systems.com/issues/08-2/',
                stories: [
                    {
                        name: 'Contrarians and Volatility Clustering',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/08-2-1.pdf',
                    },
                    {
                        name: 'Quantifying Generalization in Linearly Weighted Neural Networks',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/08-2-2.pdf',
                    },
                    {
                        name: 'Neural Networks with Complex Activations and Connection Weights',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/08-2-3.pdf',
                    },
                    {
                        name: 'Cellular Automata in the Triangular Tessellation',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/08-2-4.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 8, No. 3',
                image: 'https://content.wolfram.com/sites/13/2018/02/8_3.gif',
                url: 'https://www.complex-systems.com/issues/08-3/',
                stories: [
                    {
                        name: 'A Note on Injectivity of Additive Cellular Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/08-3-1.pdf',
                    },
                    {
                        name: "Newton's Method for Quadratics, and Nested Intervals",
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/08-3-2.pdf',
                    },
                    {
                        name: 'A Machine-Independent Analysis of Parallel Genetic Algorithms',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/08-3-3.pdf',
                    },
                    {
                        name: 'Self-Replicating Sequences of Binary Numbers: The Build-Up of Complexity',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/08-3-4.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 8, No. 4',
                image: 'https://content.wolfram.com/sites/13/2018/02/8_4.gif',
                url: 'https://www.complex-systems.com/issues/08-4/',
                stories: [
                    {
                        name: 'An Analysis of Non-Binary Genetic Algorithms with Cardinality 2υ',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/08-4-1.pdf',
                    },
                    {
                        name: 'Knowledge-Based Nonuniform Crossover',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/08-4-2.pdf',
                    },
                    {
                        name: 'Pattern Search Using Genetic Algorithms and a Neural Network Model',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/08-4-3.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 8, No. 5',
                image: 'https://content.wolfram.com/sites/13/2018/02/8_5.gif',
                url: 'https://www.complex-systems.com/issues/08-5/',
                stories: [
                    {
                        name: 'Programmable Parallel Arithmetic in Cellular Automata Using a Particle Model',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/08-5-1.pdf',
                    },
                    {
                        name: 'Language Recognizable in Real Time by Cellular Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/08-5-2.pdf',
                    },
                    {
                        name: 'Computational Properties of Boolean Networks',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/08-5-3.pdf',
                    },
                    {
                        name: 'Inherent Generation of Fractals by Cellular Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/08-5-4.pdf',
                    },
                    {
                        name: 'Parallel Chip Firing on Digraphs',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/08-5-5.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 8, No. 6',
                image: 'https://content.wolfram.com/sites/13/2018/02/8_6.gif',
                url: 'https://www.complex-systems.com/issues/08-6/',
                stories: [
                    {
                        name: 'Self-Organization and Scaling in a Lattice Predator-Prey Model',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/08-6-1.pdf',
                    },
                    {
                        name: 'A Markov Chain Analysis of Genetic Algorithms with a State Dependent Fitness Function',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/08-6-2.pdf',
                    },
                    {
                        name: 'Growing Patterns in One Dimensional Cellular Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/08-6-3.pdf',
                    },
                    {
                        name: 'Fast Parallel Arithmetic on Cellular Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/08-6-4.pdf',
                    },
                ],
            },
        ],
    ],
    [
        'Vol. 7',
        [
            {
                title: 'Vol. 7, No. 1',
                image: 'https://content.wolfram.com/sites/13/2018/02/7_1.gif',
                url: 'https://www.complex-systems.com/issues/07-1/',
                stories: [
                    {
                        name: 'Neural Networks and Cellular Automata Complexity',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/07-1-1.pdf',
                    },
                    {
                        name: 'Evolution of Bit Strings II: A Simple Model of Co-Evolution',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/07-1-2.pdf',
                    },
                    {
                        name: 'A Liquid-Crystal Model for Neural Networks',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/07-1-3.pdf',
                    },
                    {
                        name: 'Introduction to Terminal Dynamics',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/07-1-4.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 7, No. 2',
                image: 'https://content.wolfram.com/sites/13/2018/02/7_2.gif',
                url: 'https://www.complex-systems.com/issues/07-2/',
                stories: [
                    {
                        name: 'Revisiting the Edge of Chaos: Evolving Cellular Automata to Perform Computations',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/07-2-1.pdf',
                    },
                    {
                        name: 'Multimodal Deceptive Functions',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/07-2-2.pdf',
                    },
                    {
                        name: 'Finite Markov Chain Models of an Alternative Selection Strategy for the Genetic Algorithm',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/07-2-3.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 7, No. 3',
                image: 'https://content.wolfram.com/sites/13/2018/02/7_3.gif',
                url: 'https://www.complex-systems.com/issues/07-3/',
                stories: [
                    {
                        name: 'Time Series of Rational Partitions and Complexity of One-dimensional Processes',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/07-3-1.pdf',
                    },
                    {
                        name: "Evolving Optimal Neural Networks Using Genetic Algorithms with Occam's Razor",
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/07-3-2.pdf',
                    },
                    {
                        name: 'Universal Computation in Few-body Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/07-3-3.pdf',
                    },
                    {
                        name: 'A Phase Diagram for Elementary Cellular Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/07-3-4.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 7, No. 4',
                image: 'https://content.wolfram.com/sites/13/2018/02/7_4.gif',
                url: 'https://www.complex-systems.com/issues/07-4/',
                stories: [
                    {
                        name: 'A Constructive Algorithm for the Training of a Multilayer Perceptron Based on the Genetic Algorithm',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/07-4-1.pdf',
                    },
                    {
                        name: 'Complex Chaotic Behavior of a Class of Subshift Cellular Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/07-4-2.pdf',
                    },
                    {
                        name: 'Two-Dimensional FHP Lattice Gases Are Computation Universal',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/07-4-3.pdf',
                    },
                    {
                        name: 'Commutation of Cellular Automata Rules',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/07-4-4.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 7, No. 5',
                image: 'https://content.wolfram.com/sites/13/2018/02/7_5.gif',
                url: 'https://www.complex-systems.com/issues/07-5/',
                stories: [
                    {
                        name: 'Preserving the Diversity of a Genetically Evolving Population of Nets Using the Functional Behavior of Neurons',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/07-5-1.pdf',
                    },
                    {
                        name: 'Mechanisms for Pattern Generation',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/07-5-2.pdf',
                    },
                    {
                        name: 'Monomial Cellular Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/07-5-3.pdf',
                    },
                    {
                        name: 'Emerging Patterns and Computational Design of Filter Cellular Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/07-5-4.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 7, No. 6',
                image: 'https://content.wolfram.com/sites/13/2018/02/7_6.gif',
                url: 'https://www.complex-systems.com/issues/07-6/',
                stories: [
                    {
                        name: 'Numerical Modeling of Toroidal Dynamical Systems with Invariant Lebesgue Measure',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/07-6-1.pdf',
                    },
                    {
                        name: 'Undecidable Problems in Fractal Geometry',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/07-6-2.pdf',
                    },
                    {
                        name: 'Using the Functional Behavior of Neurons for Genetic Recombination in Neural Nets Training',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/07-6-3.pdf',
                    },
                    {
                        name: 'Cellular Games: An Introduction',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/07-6-4.pdf',
                    },
                ],
            },
        ],
    ],
    [
        'Vol. 6',
        [
            {
                title: 'Vol. 6, No. 1',
                image: 'https://content.wolfram.com/sites/13/2018/02/6_1.gif',
                url: 'https://www.complex-systems.com/issues/06-1/',
                stories: [
                    {
                        name: 'Can Spurious States Be Useful?',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/06-1-1.pdf',
                    },
                    {
                        name: 'Sequences Generated by Neuronal Automata with Memory',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/06-1-2.pdf',
                    },
                    {
                        name: 'Vector Fields and Neural Networks',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/06-1-3.pdf',
                    },
                    {
                        name: 'Probabilistic Information Capacity of Hopfield Associative Memory',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/06-1-4.pdf',
                    },
                    {
                        name: 'On the Connection between In-sample Testing and Generalization Error',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/06-1-5.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 6, No. 2',
                image: 'https://content.wolfram.com/sites/13/2018/02/6_2.gif',
                url: 'https://www.complex-systems.com/issues/06-2/',
                stories: [
                    {
                        name: 'Cusp-Shaped Return Maps with Period Adding in a Model of a Chemical System',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/06-2-1.pdf',
                    },
                    {
                        name: 'Kohonen Self-Organizing Maps: Is the Normalization Necessary?',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/06-2-2.pdf',
                    },
                    {
                        name: 'Walsh Functions, Schema Variance, and Deception',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/06-2-3.pdf',
                    },
                    {
                        name: 'Quantum Chaos on Hyperbolic Manifolds: A New Approach to Cosmology',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/06-2-4.pdf',
                    },
                    {
                        name: 'Regular Language Invariance under One-Dimensional Cellular Automaton Rules',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/06-2-5.pdf',
                    },
                    {
                        name: 'Habituation in Learning Vector Quantization',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/06-2-6.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 6, No. 3',
                image: 'https://content.wolfram.com/sites/13/2018/02/6_3.gif',
                url: 'https://www.complex-systems.com/issues/06-3/',
                stories: [
                    {
                        name: 'Global Optimization of Functions with the Interval Genetic Algorithm',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/06-3-1.pdf',
                    },
                    {
                        name: 'Training Recurrent Neural Networks via Trajectory Modification',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/06-3-2.pdf',
                    },
                    {
                        name: 'Cellular Automata as Algebraic Systems',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/06-3-3.pdf',
                    },
                    {
                        name: 'Diploidy and Dominance in Artificial Genetic Search',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/06-3-4.pdf',
                    },
                    {
                        name: 'Effect of Noise on Long-term Memory in Cellular Automata with Asynchronous Delays between the Processors',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/06-3-5.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 6, No. 4',
                image: 'https://content.wolfram.com/sites/13/2018/02/6_4.gif',
                url: 'https://www.complex-systems.com/issues/06-4/',
                stories: [
                    {
                        name: 'Learning from Examples and Generalization',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/06-4-1.pdf',
                    },
                    {
                        name: 'Dynamics of Multicellular Automata with Unbounded Memory',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/06-4-2.pdf',
                    },
                    {
                        name: 'Genetic Algorithms, Noise, and the Sizing of Populations',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/06-4-3.pdf',
                    },
                    {
                        name: 'Strategic Application of Feedforward Neural Networks to Large-Scale Classification',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/06-4-4.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 6, No. 5',
                image: 'https://content.wolfram.com/sites/13/2018/02/6_5.gif',
                url: 'https://www.complex-systems.com/issues/06-5/',
                stories: [
                    {
                        name: 'A Fluid-Dynamic Model for the Movement of Pedestrians',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/06-5-1.pdf',
                    },
                    {
                        name: 'The Limiting Behavior of Non-cylindrical Elementary Cellular Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/06-5-2.pdf',
                    },
                    {
                        name: 'A New Candidate Rule for the Game of Three-Dimensional Life',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/06-5-3.pdf',
                    },
                    {
                        name: 'Training Artificial Neural Networks for Fuzzy Logic',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/06-5-4.pdf',
                    },
                    {
                        name: 'A Distributed Genetic Algorithm for Neural Network Design and Training',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/06-5-5.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 6, No. 6',
                image: 'https://content.wolfram.com/sites/13/2018/02/6_6.gif',
                url: 'https://www.complex-systems.com/issues/06-6/',
                stories: [
                    {
                        name: 'Refined Pruning Techniques for Feed-forward Neural Networks',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/06-6-1.pdf',
                    },
                    {
                        name: 'A Comparison between Squared Error and Relative Entropy Metrics Using Several Optimization Algorithms',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/06-6-2.pdf',
                    },
                    {
                        name: 'The Behavior and Learning of a Deterministic Neural Net',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/06-6-3.pdf',
                    },
                    {
                        name: 'Distribution of Linear Rules in Cellular Automata Rule Space',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/06-6-4.pdf',
                    },
                    {
                        name: 'Schema Analysis of the Traveling Salesman Problem Using Genetic Algorithms',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/06-6-5.pdf',
                    },
                ],
            },
        ],
    ],
    [
        'Vol. 5',
        [
            {
                title: 'Vol. 5, No. 1',
                image: 'https://content.wolfram.com/sites/13/2018/02/5_1.gif',
                url: 'https://www.complex-systems.com/issues/05-1/',
                stories: [
                    {
                        name: 'A Multispeed Model for Lattice Gas Hydrodynamics',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/05-1-1.pdf',
                    },
                    {
                        name: 'A New Game of Three-Dimensional Life',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/05-1-2.pdf',
                    },
                    {
                        name: 'De Bruijn Graphs and Linear Cellular Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/05-1-3.pdf',
                    },
                    {
                        name: 'Punctuated Equilibria in Genetic Search',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/05-1-4.pdf',
                    },
                    {
                        name: 'Polynomials, Basis Sets, and Deceptiveness in Genetic Algorithms',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/05-1-5.pdf',
                    },
                    {
                        name: 'Testing Parallel Simulators for Two-Dimensional Lattice-Gas Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/05-1-6.pdf',
                    },
                    {
                        name: 'Numerical Simulations of Fluid Dynamics with a Pair Interaction Automaton in Two Dimensions',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/05-1-7.pdf',
                    },
                    {
                        name: 'Complex Systems: Errata and Changes Volumes 3 and 4',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/05-1-8.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 5, No. 2',
                image: 'https://content.wolfram.com/sites/13/2018/02/5_2.gif',
                url: 'https://www.complex-systems.com/issues/05-2/',
                stories: [
                    {
                        name: 'Phase-Space Study of Bistable Cellular Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/05-2-1.pdf',
                    },
                    {
                        name: 'Real-coded Genetic Algorithms, Virtual Alphabets, and Blocking',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/05-2-2.pdf',
                    },
                    {
                        name: 'Geometry and Arithmetic of a Simple Cellular Automaton',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/05-2-3.pdf',
                    },
                    {
                        name: 'Equivalence Class Analysis of Genetic Algorithms',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/05-2-4.pdf',
                    },
                    {
                        name: 'Demystifying Quantum Mechanics: A Simple Universe with Quantum Uncertainty',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/05-2-5.pdf',
                    },
                    {
                        name: 'Comparison of Inductive Versus Deductive Learning Networks',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/05-2-6.pdf',
                    },
                    {
                        name: 'Confirmation in Experimental Mathematics: A Case Study',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/05-2-7.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 5, No. 3',
                image: 'https://content.wolfram.com/sites/13/2018/02/5_3.gif',
                url: 'https://www.complex-systems.com/issues/05-3/',
                stories: [
                    {
                        name: 'Genetic Algorithms and the Variance of Fitness',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/05-3-1.pdf',
                    },
                    {
                        name: 'Evolution of Bit Strings: Some Preliminary Results',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/05-3-2.pdf',
                    },
                    {
                        name: 'Large-Step Markov Chains for the Traveling Salesman Problem',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/05-3-3.pdf',
                    },
                    {
                        name: 'A Two-Dimensional Genetic Algorithm for the Ising Problem',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/05-3-4.pdf',
                    },
                    {
                        name: 'Structure and Uncomputability in One-Dimensional Maps',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/05-3-5.pdf',
                    },
                    {
                        name: 'Fixed Points of Majority Rule Cellular Automata with Application to Plasticity and Precision of the Immune System',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/05-3-6.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 5, No. 4',
                image: 'https://content.wolfram.com/sites/13/2018/02/5_4.gif',
                url: 'https://www.complex-systems.com/issues/05-4/',
                stories: [
                    {
                        name: 'Chaos-based Learning',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/05-4-1.pdf',
                    },
                    {
                        name: 'Optimization of the Architecture of Feed-forward Neural Networks with Hidden Layers by Unit Elimination',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/05-4-2.pdf',
                    },
                    {
                        name: 'On the Relationship between Complexity and Entropy for Markov Chains and Regular Languages',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/05-4-3.pdf',
                    },
                    {
                        name: 'On Dynamical Properties of Neural Networks',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/05-4-4.pdf',
                    },
                    {
                        name: 'Robust Quasihomogeneous Configurations in Coupled Map Lattices',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/05-4-5.pdf',
                    },
                    {
                        name: 'Period-Doublings to Chaos in a Simple Neural Network: An Analytical Proof',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/05-4-6.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 5, No. 5',
                image: 'https://content.wolfram.com/sites/13/2018/02/5_5.gif',
                url: 'https://www.complex-systems.com/issues/05-5/',
                stories: [
                    {
                        name: 'Improved Evolutionary Optimization of Difficult Landscapes: Control of Premature Convergence through Scheduled Sharing',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/05-5-1.pdf',
                    },
                    {
                        name: "Darwin's Continent Cycle Theory and Its Simulation by the Prisoner's Dilemma",
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/05-5-2.pdf',
                    },
                    {
                        name: 'Binary Addition on Cellular Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/05-5-3.pdf',
                    },
                    {
                        name: 'Driver Mechanisms on Cellular Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/05-5-4.pdf',
                    },
                    {
                        name: 'Decision Procedures for Openness and Local Injectivity',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/05-5-5.pdf',
                    },
                    {
                        name: 'Design and Analysis of Competition-Based Neural Networks',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/05-5-6.pdf',
                    },
                    {
                        name: 'On the Predictability of Coupled Automata: An Allegory about Chaos',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/05-5-7.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 5, No. 6',
                image: 'https://content.wolfram.com/sites/13/2018/02/5_6.gif',
                url: 'https://www.complex-systems.com/issues/05-6/',
                stories: [
                    {
                        name: 'A Thermodynamic Automaton with Four Temperatures and Three Controls',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/05-6-1.pdf',
                    },
                    {
                        name: 'Mathematical Properties of Thermodynamic Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/05-6-2.pdf',
                    },
                    {
                        name: 'The Cellular Device Machine Development System for Modeling Biology on the Computer',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/05-6-3.pdf',
                    },
                    {
                        name: 'Bayesian Back-Propagation',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/05-6-4.pdf',
                    },
                    {
                        name: 'Complex Systems: Errata and Changes',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/05-6-5.pdf',
                    },
                ],
            },
        ],
    ],
    [
        'Vol. 4',
        [
            {
                title: 'Vol. 4, No. 1',
                image: 'https://content.wolfram.com/sites/13/2018/02/4_1.gif',
                url: 'https://www.complex-systems.com/issues/04-1/',
                stories: [
                    {
                        name: 'Period-Adding Phenomenon in a Model of Chemical System',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/04-1-1.pdf',
                    },
                    {
                        name: 'Evolution, Learning, and Culture: Computational Metaphors for Adaptive Algorithms',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/04-1-2.pdf',
                    },
                    {
                        name: 'Stochastic Approximation and Multilayer Perceptrons: The Gain Backpropagation Algorithm',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/04-1-3.pdf',
                    },
                    {
                        name: 'Comparison of Self-Organization and Optimization in Evolution and Neural Network Models',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/04-1-4.pdf',
                    },
                    {
                        name: 'Learning by Choice of Internal Representations: An Energy Minimization Approach',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/04-1-5.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 4, No. 2',
                image: 'https://content.wolfram.com/sites/13/2018/02/4_2.gif',
                url: 'https://www.complex-systems.com/issues/04-2/',
                stories: [
                    {
                        name: 'Recursive Cellular Automata Invariant Sets',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/04-2-1.pdf',
                    },
                    {
                        name: 'Nonrecursive Cellular Automata Invariant Sets',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/04-2-2.pdf',
                    },
                    {
                        name: 'Numerical Simulations of Hydrodynamics with a Pair Interaction Automaton in Two Dimensions',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/04-2-3.pdf',
                    },
                    {
                        name: 'A Mathematical Theory of Generalization: Part I',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/04-2-4.pdf',
                    },
                    {
                        name: 'A Mathematical Theory of Generalization: Part II',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/04-2-5.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 4, No. 3',
                image: 'https://content.wolfram.com/sites/13/2018/02/4_3.gif',
                url: 'https://www.complex-systems.com/issues/04-3/',
                stories: [
                    {
                        name: 'A Cellular Automaton for a Solvable Boltzmann Equation',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/04-3-1.pdf',
                    },
                    {
                        name: 'Backpropagation is Sensitive to Initial Conditions',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/04-3-2.pdf',
                    },
                    {
                        name: 'The Structure of the Elementary Cellular Automata Rule Space',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/04-3-3.pdf',
                    },
                    {
                        name: 'Universal Computation in Simple One-Dimensional Cellular Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/04-3-4.pdf',
                    },
                    {
                        name: "The Relationship Between Occam's Razor and Convergent Guessing",
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/04-3-5.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 4, No. 4',
                image: 'https://content.wolfram.com/sites/13/2018/02/4_4.gif',
                url: 'https://www.complex-systems.com/issues/04-4/',
                stories: [
                    {
                        name: 'Epistasis Variance: Suitability of a Representation to Genetic Algorithms',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/04-4-1.pdf',
                    },
                    {
                        name: 'Cellular Automata with Regular Behavior',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/04-4-2.pdf',
                    },
                    {
                        name: 'The Effect of Learning on the Evolution of Asexual Populations',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/04-4-3.pdf',
                    },
                    {
                        name: 'Messy Genetic Algorithms Revisited: Studies in Mixed Size and Scale',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/04-4-4.pdf',
                    },
                    {
                        name: 'A Note on Boltzmann Tournament Selection for Genetic Algorithms and Population-Oriented Simulated Annealing',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/04-4-5.pdf',
                    },
                    {
                        name: 'Designing Neural Networks Using Genetic Algorithms with Graph Generation System',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/04-4-6.pdf',
                    },
                    {
                        name: 'Benchmark of Some Learning Algorithms for Single-Layer and Hopfield Networks',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/04-4-7.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 4, No. 5',
                image: 'https://content.wolfram.com/sites/13/2018/02/4_5.gif',
                url: 'https://www.complex-systems.com/issues/04-5/',
                stories: [
                    {
                        name: 'Partitions, Rational Partitions, and Characterization of Complexity',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/04-5-1.pdf',
                    },
                    {
                        name: 'Global Dynamics in Neural Networks II',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/04-5-2.pdf',
                    },
                    {
                        name: 'Learning by CHIR without Storing Internal Representations',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/04-5-3.pdf',
                    },
                    {
                        name: 'A Genetic Learning Algorithm for the Analysis of Complex Data',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/04-5-4.pdf',
                    },
                    {
                        name: 'Training Feed Forward Nets with Binary Weights via a Modified CHIR Algorithm',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/04-5-5.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 4, No. 6',
                image: 'https://content.wolfram.com/sites/13/2018/02/4_6.gif',
                url: 'https://www.complex-systems.com/issues/04-6/',
                stories: [
                    {
                        name: 'Division Algorithm for Cellular Automata Rules',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/04-6-1.pdf',
                    },
                    {
                        name: 'The Discovery of a New Glider for the Game of Three-Dimensional Life',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/04-6-2.pdf',
                    },
                    {
                        name: 'Exploiting Neurons with Localized Receptive Fields to Learn Chaos',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/04-6-3.pdf',
                    },
                    {
                        name: 'Behavior of Topological Cellular Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/04-6-4.pdf',
                    },
                    {
                        name: 'Continuous Transitions of Cellular Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/04-6-5.pdf',
                    },
                ],
            },
        ],
    ],
    [
        'Vol. 3',
        [
            {
                title: 'Vol. 3, No. 1',
                image: 'https://content.wolfram.com/sites/13/2018/02/3_1.gif',
                url: 'https://www.complex-systems.com/issues/03-1/',
                stories: [
                    {
                        name: 'Abnormal Diffusion in Wind-tree Lattice Gases',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/03-1-1.pdf',
                    },
                    {
                        name: 'A Travelling Salesman Approach to Protein Conformation',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/03-1-2.pdf',
                    },
                    {
                        name: 'Global Dynamics in Neural Networks',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/03-1-3.pdf',
                    },
                    {
                        name: 'Chaotic Optimization and the Construction of Fractals: Solution of an Inverse Problem',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/03-1-4.pdf',
                    },
                    {
                        name: 'Formal Languages and Finite Cellular Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/03-1-5.pdf',
                    },
                    {
                        name: 'Symbiotic Programming: Crossbreeding Cellular Automaton Rules on the CAM-6',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/03-1-6.pdf',
                    },
                    {
                        name: 'Backpropagation Can Give Rise to Spurious Local Minima Even for Networks without Hidden Layers',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/03-1-7.pdf',
                    },
                    {
                        name: 'A Note on Culik-Yu Classes',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/03-1-8.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 3, No. 2',
                image: 'https://content.wolfram.com/sites/13/2018/02/3_2.gif',
                url: 'https://www.complex-systems.com/issues/03-2/',
                stories: [
                    {
                        name: 'Periodic Points and Entropies for Cellular Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/03-2-1.pdf',
                    },
                    {
                        name: 'Genetic Algorithms and Walsh Functions: Part I, A Gentle Introduction',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/03-2-2.pdf',
                    },
                    {
                        name: 'Genetic Algorithms and Walsh Functions: Part II, Deception and Its Analysis',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/03-2-3.pdf',
                    },
                    {
                        name: 'Local Graph Transformations Driven by Lyapunov Functionals',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/03-2-4.pdf',
                    },
                    {
                        name: 'The Choice Problem: Neural Network Learning, Generalization, and Geometry',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/03-2-5.pdf',
                    },
                    {
                        name: 'Algebraic Theory of Bounded One-dimensional Cellular Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/03-2-6.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 3, No. 3',
                image: 'https://content.wolfram.com/sites/13/2018/02/3_3.gif',
                url: 'https://www.complex-systems.com/issues/03-3/',
                stories: [
                    {
                        name: 'Learning by Minimizing Resources in Neural Networks',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/03-3-1.pdf',
                    },
                    {
                        name: 'How the Lattice Gas Model for the Navier-Stokes Equation Improves When a New Speed is Added',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/03-3-2.pdf',
                    },
                    {
                        name: 'Fractal and Recurrent Behavior of Cellular Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/03-3-3.pdf',
                    },
                    {
                        name: 'Energy Functions in Neural Networks with Continuous Local Functions',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/03-3-4.pdf',
                    },
                    {
                        name: 'Using Artificial Neural Nets for Statistical Discovery: Observations after Using Backpropogation, Expert Systems, and Multiple-Linear Regression on Clinical Trial Data',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/03-3-5.pdf',
                    },
                    {
                        name: 'Comment on "Abnormal Diffusion in Wind-tree Lattice Gasses"',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/03-3-6.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 3, No. 4',
                image: 'https://content.wolfram.com/sites/13/2018/02/3_4.gif',
                url: 'https://www.complex-systems.com/issues/03-4/',
                stories: [
                    {
                        name: 'Lattice Boltzmann Equation for Laminar Boundary Flow',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/03-4-1.pdf',
                    },
                    {
                        name: 'Accelerated Backpropagation Learning: Two Optimization Methods',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/03-4-2.pdf',
                    },
                    {
                        name: 'One-Dimensional Cellular Automata: Injectivity From Unambiguity',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/03-4-3.pdf',
                    },
                    {
                        name: 'A Focused Backpropagation Algorithm for Temporal Pattern Recognition',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/03-4-4.pdf',
                    },
                    {
                        name: 'Cellular Automaton Model for Fluid Flow in Porous Media',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/03-4-5.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 3, No. 5',
                image: 'https://content.wolfram.com/sites/13/2018/02/3_5.gif',
                url: 'https://www.complex-systems.com/issues/03-5/',
                stories: [
                    {
                        name: 'The CHIR Algorithm: A Generalization for Multiple-Output and Multilayered Networks',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/03-5-1.pdf',
                    },
                    {
                        name: 'Enumeration of Preimages in Cellular Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/03-5-2.pdf',
                    },
                    {
                        name: 'Stochastic Stability of Nonsymmetric Threshold Networks',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/03-5-3.pdf',
                    },
                    {
                        name: 'Spontaneously Activated Systems in Neurodynamics',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/03-5-4.pdf',
                    },
                    {
                        name: 'Messy Genetic Algorithms: Motivation, Analysis, and First Results',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/03-5-5.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 3, No. 6',
                image: 'https://content.wolfram.com/sites/13/2018/02/3_6.gif',
                url: 'https://www.complex-systems.com/issues/03-6/',
                stories: [
                    {
                        name: 'Neural Networks and Graph K-Partitioning',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/03-6-1.pdf',
                    },
                    {
                        name: 'On the Computational Complexity of Analyzing Hopfield Nets',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/03-6-2.pdf',
                    },
                    {
                        name: 'Exponential Transient Classes of Symmetric Neural Networks for Synchronous and Sequential Updating',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/03-6-3.pdf',
                    },
                    {
                        name: 'Period Multiplying Operators on Integer Sequences Modulo A Prime',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/03-6-4.pdf',
                    },
                    {
                        name: 'Particles in Soliton Cellular Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/03-6-5.pdf',
                    },
                ],
            },
        ],
    ],
    [
        'Vol. 2',
        [
            {
                title: 'Vol. 2, No. 1',
                image: 'https://content.wolfram.com/sites/13/2018/02/2_1.gif',
                url: 'https://www.complex-systems.com/issues/02-1/',
                stories: [
                    {
                        name: 'On -Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/02-1-1.pdf',
                    },
                    {
                        name: 'Simulations of Mixtures of Two Boolean Cellular Automata Rules',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/02-1-2.pdf',
                    },
                    {
                        name: 'Scaling Relationships in Back-propagation Learning',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/02-1-3.pdf',
                    },
                    {
                        name: 'Lattice Gas Automata of Fluid Dynamics for Unsteady Flow',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/02-1-4.pdf',
                    },
                    {
                        name: 'Neural Networks and NP-complete Optimization Problems; A Performance Study on the Graph Bisection Problem',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/02-1-5.pdf',
                    },
                    {
                        name: 'Parity Filter Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/02-1-6.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 2, No. 2',
                image: 'https://content.wolfram.com/sites/13/2018/02/2_2.gif',
                url: 'https://www.complex-systems.com/issues/02-2/',
                stories: [
                    {
                        name: 'Dynamical Behavior of a Neural Automaton with Memory',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/02-2-1.pdf',
                    },
                    {
                        name: 'Undecidability of CA Classification Schemes',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/02-2-2.pdf',
                    },
                    {
                        name: 'Steepest Descent Can Take Exponential Time for Symmetric Connection Networks',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/02-2-3.pdf',
                    },
                    {
                        name: 'Quantum Cellular Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/02-2-4.pdf',
                    },
                    {
                        name: 'Periodic Patterns in the Binary Difference Field',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/02-2-5.pdf',
                    },
                    {
                        name: 'Classification of Semitotalistic Cellular Automata in Three Dimensions',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/02-2-6.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 2, No. 3',
                image: 'https://content.wolfram.com/sites/13/2018/02/2_3.gif',
                url: 'https://www.complex-systems.com/issues/02-3/',
                stories: [
                    {
                        name: 'A Note on the Discovery of a New Game of Three-dimensional Life',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/02-3-1.pdf',
                    },
                    {
                        name: 'Simple Lattice Gas Models for Waves',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/02-3-2.pdf',
                    },
                    {
                        name: 'Complexity of Forecasting in a Class of Simple Models',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/02-3-3.pdf',
                    },
                    {
                        name: 'Gain Variation in Recurrent Error Propagation Networks',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/02-3-4.pdf',
                    },
                    {
                        name: 'Multivariable Functional Interpolation and Adaptive Networks',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/02-3-5.pdf',
                    },
                    {
                        name: 'On the Entropy Geometry of Cellular Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/02-3-6.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 2, No. 4',
                image: 'https://content.wolfram.com/sites/13/2018/02/2_4.gif',
                url: 'https://www.complex-systems.com/issues/02-4/',
                stories: [
                    {
                        name: 'Basins of Attraction in a Perceptron-Like Neural Network',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/02-4-1.pdf',
                    },
                    {
                        name: 'Complexity Measures and Cellular Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/02-4-2.pdf',
                    },
                    {
                        name: 'On Synchronization and Phase Locking in Strongly Coupled Systems of Planar Rotators',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/02-4-3.pdf',
                    },
                    {
                        name: 'Coarse-Coded Symbol Memories and Their Properties',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/02-4-4.pdf',
                    },
                    {
                        name: 'Domains and Distances in Magnetic Systems',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/02-4-5.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 2, No. 5',
                image: 'https://content.wolfram.com/sites/13/2018/02/2_5.gif',
                url: 'https://www.complex-systems.com/issues/02-5/',
                stories: [
                    {
                        name: 'Decreasing Energy Functions and Lengths of Transients for Some Cellular Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/02-5-1.pdf',
                    },
                    {
                        name: 'Competitive Dynamics in a Dual-route Connectionist Model of Print-to-sound Transformation',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/02-5-2.pdf',
                    },
                    {
                        name: 'The Non-wandering Set of a CA Map',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/02-5-3.pdf',
                    },
                    {
                        name: 'Learning by Choice of Internal Representations',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/02-5-4.pdf',
                    },
                    {
                        name: 'Method of Computation of the Reynolds Number for Two Models of Lattice Gas Involving Violation of Semi-detailed Balance',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/02-5-5.pdf',
                    },
                    {
                        name: 'Quantum Cellular Automata: A Corrigendum',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/02-5-6.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 2, No. 6',
                image: 'https://content.wolfram.com/sites/13/2018/02/2_6.gif',
                url: 'https://www.complex-systems.com/issues/02-6/',
                stories: [
                    {
                        name: 'Accelerated Learning in Layered Neural Networks',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/02-6-1.pdf',
                    },
                    {
                        name: 'Teaching Feed-Forward Neural Networks by Simulated Annealing',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/02-6-2.pdf',
                    },
                    {
                        name: 'Additive Automata On Graphs',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/02-6-3.pdf',
                    },
                    {
                        name: "Simulating the Evolution of Behavior: the Iterated Prisoners' Dilemma Problem",
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/02-6-4.pdf',
                    },
                    {
                        name: 'Hard Learning the Easy Way: Backpropagation with Deformation',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/02-6-5.pdf',
                    },
                    {
                        name: 'Bid Competition and Specificity Reconsidered',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/02-6-6.pdf',
                    },
                    {
                        name: 'Complex Systems: Errata and Changes, Volumes 1 and 2',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/02-6-7.pdf',
                    },
                ],
            },
        ],
    ],
    [
        'Vol. 1',
        [
            {
                title: 'Vol. 1, No. 1',
                image: 'https://content.wolfram.com/sites/13/2018/02/1_1.gif',
                url: 'https://www.complex-systems.com/issues/01-1/',
                stories: [
                    {
                        name: 'A Simple Universal Cellular Automaton and its One-Way and Totalistic Version',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/01-1-1.pdf',
                    },
                    {
                        name: "A Cellular Automaton for Burgers' Equation",
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/01-1-2.pdf',
                    },
                    {
                        name: 'Buoyant Mixtures of Cellular Automaton Gases',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/01-1-3.pdf',
                    },
                    {
                        name: 'Cellular Automaton Public-Key Cryptosystem',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/01-1-4.pdf',
                    },
                    {
                        name: 'Local Structure Theory in More Than One Dimension',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/01-1-5.pdf',
                    },
                    {
                        name: 'Formal Language Characterization of Cellular Automaton Limit Sets',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/01-1-6.pdf',
                    },
                    {
                        name: 'Self-Configuration of Defective Cellular Arrays',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/01-1-7.pdf',
                    },
                    {
                        name: 'Power Spectra of Regular Languages and Cellular Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/01-1-8.pdf',
                    },
                    {
                        name: 'The Free Energy Concept in Cellular Automaton Models of Solid-Solid Phase Transitions',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/01-1-9.pdf',
                    },
                    {
                        name: 'Parallel Networks that Learn to Pronounce English Text',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/01-1-10.pdf',
                    },
                    {
                        name: 'Competition of Cellular Automata Rules',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/01-1-11.pdf',
                    },
                    {
                        name: 'Upper Bound on the Number of Cycles in Border-Decisive Cellular Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/01-1-12.pdf',
                    },
                    {
                        name: 'A Cellular Automaton Model Based on Cortical Physiology',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/01-1-13.pdf',
                    },
                    {
                        name: 'On the Periods of Some Graph Transformations',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/01-1-14.pdf',
                    },
                    {
                        name: 'Fast Computation of Additive Cellular Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/01-1-15.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 1, No. 2',
                image: 'https://content.wolfram.com/sites/13/2018/02/1_2.gif',
                url: 'https://www.complex-systems.com/issues/01-2/',
                stories: [
                    {
                        name: 'The Value of a Random Game: The Advantage of Rationality',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/01-2-1.pdf',
                    },
                    {
                        name: 'Inhomogeneous Cellular Automata and Statistical Mechanics',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/01-2-2.pdf',
                    },
                    {
                        name: 'Virtual State Machines in Cellular Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/01-2-3.pdf',
                    },
                    {
                        name: 'Efficient Algorithms with Neural Network Behavior',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/01-2-4.pdf',
                    },
                    {
                        name: 'The 3x+1 Problem: A Quasi Cellular Automaton',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/01-2-5.pdf',
                    },
                    {
                        name: 'Further Evidence for Randomness in ',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/01-2-6.pdf',
                    },
                    {
                        name: 'Scaling Relationships in Back-Propagation Learning: Dependence on Training Set Size',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/01-2-7.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 1, No. 3',
                image: 'https://content.wolfram.com/sites/13/2018/02/1_3.gif',
                url: 'https://www.complex-systems.com/issues/01-3/',
                stories: [
                    {
                        name: 'Candidates for the Game of Life in Three Dimensions',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/01-3-1.pdf',
                    },
                    {
                        name: 'Closed Loop Identification in Diffusion-limited Aggregation Processes',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/01-3-2.pdf',
                    },
                    {
                        name: 'Equations of Motion from a Data Series',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/01-3-3.pdf',
                    },
                    {
                        name: 'NP-Complete Problems in Cellular Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/01-3-4.pdf',
                    },
                    {
                        name: 'Isometric Collision Rules for the Four-Dimensional FCHC Lattice Gas',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/01-3-5.pdf',
                    },
                    {
                        name: 'How Learning Can Guide Evolution',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/01-3-6.pdf',
                    },
                    {
                        name: 'Structurally Dynamic Cellular Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/01-3-7.pdf',
                    },
                    {
                        name: 'Correlations and Random Information in Cellular Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/01-3-8.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 1, No. 4',
                image: 'https://content.wolfram.com/sites/13/2018/02/1_4.gif',
                url: 'https://www.complex-systems.com/issues/01-4/',
                stories: [
                    {
                        name: 'On Lagrangian Aspects of Flow Simulation',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/01-4-1.pdf',
                    },
                    {
                        name: 'Lattice Models of the Lorentz Gas: Physical and Dynamical Properties',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/01-4-2.pdf',
                    },
                    {
                        name: 'Exact Solutions for Some Discrete Models of the Boltzmann Equation',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/01-4-3.pdf',
                    },
                    {
                        name: 'RAP1, a Cellular Automaton Machine for Fluid Dynamics',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/01-4-4.pdf',
                    },
                    {
                        name: 'Numerical Simulations of Hydrodynamics with Lattice Gas Automata in Two Dimensions',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/01-4-5.pdf',
                    },
                    {
                        name: 'Numerical Experiments on Lattice Gases: Mixtures and Galilean Invariance',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/01-4-6.pdf',
                    },
                    {
                        name: 'Lattice Gas Hydrodynamics in Two and Three Dimensions',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/01-4-7.pdf',
                    },
                    {
                        name: 'The Hydrodynamical Description for a Discrete Velocity Model of Gas',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/01-4-8.pdf',
                    },
                    {
                        name: 'Compressible Rayleigh-Benard Spectral Simulations: A Useful Reference Solution',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/01-4-9.pdf',
                    },
                    {
                        name: 'The Effect of Galilean Non-Invariance in Lattice Gas Automaton One-Dimensional Flow',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/01-4-11.pdf',
                    },
                    {
                        name: 'Viscosity of a Lattice Gas',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/01-4-12.pdf',
                    },
                    {
                        name: 'A Poiseuille Viscometer for Lattice Gas Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/01-4-13.pdf',
                    },
                    {
                        name: 'Eddy Viscosity and Diffusivity: Exact Formulas and Approximations',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/01-4-14.pdf',
                    },
                    {
                        name: 'Dimension Densities for Turbulent Systems with Spatially Decaying Correlation Functions',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/01-4-15.pdf',
                    },
                    {
                        name: 'Two Cellular Automata for Plasma Computations',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/01-4-16.pdf',
                    },
                    {
                        name: 'Green-Kubo Formalism for Lattice Gas Hydrodynamics and Monte-Carlo Evaluation of Shear Viscosities',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/01-4-17.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 1, No. 5',
                image: 'https://content.wolfram.com/sites/13/2018/02/1_5.gif',
                url: 'https://www.complex-systems.com/issues/01-5/',
                stories: [
                    {
                        name: 'Patterns for Simple Cellular Automata in a Universe of Dense-Packed Spheres',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/01-5-1.pdf',
                    },
                    {
                        name: 'Large Automatic Learning, Rule Extraction, and Generalization',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/01-5-2.pdf',
                    },
                    {
                        name: 'Quantum Fractals',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/01-5-3.pdf',
                    },
                    {
                        name: 'Performance of VLSI Engines for Lattice Computations',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/01-5-4.pdf',
                    },
                    {
                        name: 'Cellular Automata Machines',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/01-5-5.pdf',
                    },
                    {
                        name: 'A Mean Field Theory Learning Algorithm for Neural Networks',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/01-5-6.pdf',
                    },
                    {
                        name: 'Transformations on Graphs and Convexity',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/01-5-7.pdf',
                    },
                ],
            },
            {
                title: 'Vol. 1, No. 6',
                image: 'https://content.wolfram.com/sites/13/2018/02/1_6.gif',
                url: 'https://www.complex-systems.com/issues/01-6/',
                stories: [
                    {
                        name: 'On Invertible Cellular Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/01-6-1.pdf',
                    },
                    {
                        name: 'Scaling of Preimages In Cellular Automata',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/01-6-2.pdf',
                    },
                    {
                        name: 'Stability of Equilibrial States and Limit Cycles in Sparsely Connected, Structurally Complex Boolean Nets',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/01-6-3.pdf',
                    },
                    {
                        name: 'Complexity, Depth, and Sophistication',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/01-6-4.pdf',
                    },
                    {
                        name: 'Entropy Estimates for Dynamical Systems',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/01-6-5.pdf',
                    },
                    {
                        name: 'Efficient Parallel Simulations of Asynchronous Cellular Arrays',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/01-6-6.pdf',
                    },
                    {
                        name: 'Complex Systems: Errata and Changes, Volume 1',
                        pdf: 'https://content.wolfram.com/sites/13/2018/02/01-6-7.pdf',
                    },
                ],
            },
        ],
    ],
]);

const downloadPDF = async (url, filepath) => {
    try {
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'stream',
        });

        const writer = fs.createWriteStream(filepath);
        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    } catch (error) {
        console.error(`Error downloading ${url}: ${error}`);
    }
};

const downloadAllPDFs = async () => {
    for (const [title, volume] of volumes.entries()) {
        const volumeDir = path.join(__dirname, './complex-systems/', title);
        await mkdir(volumeDir, {recursive: true});

        for (const issue of volume) {
            const issueDir = path.join(volumeDir, issue.title.replace(title + ', ', ''));
            await mkdir(issueDir, {recursive: true});

            for (const story of issue.stories) {
                const pdfPath = path.join(issueDir, `${story.name}.pdf`);
                console.dir({pdfPath});
                console.log(`Downloading: ${story.name}`);
                await downloadPDF(story.pdf, pdfPath);
            }
        }
    }
};

downloadAllPDFs().then(() => console.log('All PDFs have been downloaded.'));
