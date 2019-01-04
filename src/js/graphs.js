
import * as esprima from 'esprima';
import * as esgraph from 'esgraph';
import { getCode2 } from './submit-code';

let trueNodesLines = [];
let falseNodesLines = [];

function getGraphCode(args, codeToParse) {
    let parsed = parseCode(codeToParse);
    let cfg = esgraph(parsed.body[0].body);
    let graph = esgraph.dot(cfg, { source: codeToParse });
    graph = prepareGraph(graph);
    graph = shapes(graph);
    graph = mergeAss(graph);
    graph = insertIndex(graph);
    let valuesTable = getCode2(codeToParse, args);
    graph = fillGraphNew(graph, valuesTable, codeToParse);
    graph = putLabels(graph);
    graph = insertMergeNode(graph);
    return graph;

}


function insertMergeNode(graph) {
    let graphLines = graph.split((/\r?\n/));
    let length = graphLines.length;
    for (var i = 0; i < length; i++) {
        if (graphLines[i].includes('->') && !graphLines[i].includes('pointTo')) {
            let pointTo = getArrows(graphLines, i);
            let node1 = graphLines[i].substring(graphLines[i].indexOf('>') + 2);
            node1 = node1.substring(0, node1.indexOf('['));
            if (pointTo.length > 1) {
                graphLines = newNode(graphLines, node1);
                graphLines = changeArrows(graphLines, 'pointTo' + node1, node1);
                graphLines.push('\npointTo' + node1 + ' -> ' + node1 + '[]');
            }

        }
    }
    return graphLines.join('\n').replace(/(^[ \t]*\n)/gm, '');
}

function newNode(graphLines, node) {

    graphLines.push('\npointTo' + node + '[label="",style=filled,color=lightgrey]');
    return graphLines;
}

function changeArrows(graphLines, nodename, node) {
    for (var i = 0; i < graphLines.length; i++) {
        if (graphLines[i].includes(' -> ' + node)) {
            graphLines[i] = graphLines[i].replace(' -> ' + node, ' -> ' + nodename);
        }

    }
    return graphLines;
}

function getArrows(graphLines, i) {
    let node1 = graphLines[i].substring(graphLines[i].indexOf('>') + 2);
    node1 = node1.substring(0, node1.indexOf('['));
    let pointTo = [];


    for (var j = 0; j < graphLines.length; j++) {
        if (graphLines[j].includes('-> ' + node1)) {
            pointTo.push(graphLines[j].substring(0, graphLines[j].indexOf('-')));
        }
    }
    return pointTo;
}

function parseCode(codeToParse) {
    return esprima.parse(codeToParse, { range: true });
}


function prepareGraph(graph) {
    let graphLines = graph.split((/\r?\n/));
    for (var i = 0; i < graphLines.length; i++) {
        var conditions2 = ['label="entry"', 'label="exit"'];
        var test2 = conditions2.some(el => graphLines[i].includes(el));
        if (test2) {
            let nodeName = graphLines[i].substring(0, graphLines[i].indexOf('['));
            graphLines[i] = '';
            for (var j = i; j < graphLines.length; j++) {
                if (graphLines[j].includes(nodeName))
                    graphLines[j] = '';
            }
        }
        graphLines[i] = graphLines[i].replace('label="true"', '');
        graphLines[i] = graphLines[i].replace('label="false"', '');
        graphLines[i] = graphLines[i].replace('let ', '');
    }
    return graphLines.join('\n').replace(/(^[ \t]*\n)/gm, '');
}



function putLabels(graph) {
    let graphLines = graph.split((/\r?\n/));
    for (var i = 0; i < graphLines.length; i++) {
        if (graphLines[i].includes('->')) {
            let node1 = graphLines[i].substring(graphLines[i].indexOf('>') + 2);
            node1 = node1.substring(0, node1.indexOf('['));
            let node2 = graphLines[i].substring(0, graphLines[i].indexOf('-'));
            let line1 = getLineOfNode(node1, graphLines);
            if (getPointTo(graphLines, node2).length > 1) {
                graphLines = checkIfTF(line1, graphLines, i);
            }
        }
    }
    return graphLines.join('\n').replace(/(^[ \t]*\n)/gm, '');
}

function checkIfTF(line1, graphLines, i) {
    if (trueNodesLines.includes(line1))
        graphLines[i] = graphLines[i].replace('[]', '[label="T"]');
    if (falseNodesLines.includes(line1))
        graphLines[i] = graphLines[i].replace('[]', '[label="F"]');
    return graphLines;
}



function fillGraphNew(graph, valuesTable, codeToParse) {
    let graphLines = graph.split((/\r?\n/));
    let i = 0;
    let end = false;
    while (i < graphLines.length && !end) {
        let name = graphLines[i].substring(0, graphLines[i].indexOf('['));
        let pointTo = getPointTo(graphLines, name);
        if (graphLines[i].includes('color=green'))//if it's while and already pass
            i = chooseFalseNode(pointTo, graphLines);
        else
            graphLines[i] = graphLines[i].replace('[label', '[style=filled,color=green,label');
        if (pointTo.length === 0)
            end = true;
        else 
            i = getI(i, pointTo, valuesTable, codeToParse, graphLines);
    }
    return graphLines.join('\n').replace(/(^[ \t]*\n)/gm, '');
}

function getI(i, pointTo, valuesTable, codeToParse, graphLines) {
    if (pointTo.length === 1)
        i = getLineOfNode(pointTo[0], graphLines);
    else
        i = chooseNode(i, pointTo, valuesTable, codeToParse, graphLines);
    return i;
}



function chooseFalseNode(pointTo, graphLines) {

    return getLineOfNode(pointTo[1], graphLines);


}

function chooseNode(i, pointTo, valuesTable, codeToParse, graphLines) {
    let truthVal = getTruthVal(i, valuesTable, codeToParse, graphLines);
    if (truthVal === 'true') {
        i = getLineOfNode(pointTo[0], graphLines);
        trueNodesLines.push(i);
        falseNodesLines.push(getLineOfNode(pointTo[1], graphLines));

    }
    else {
        i = getLineOfNode(pointTo[1], graphLines);
        falseNodesLines.push(i);
        trueNodesLines.push(getLineOfNode(pointTo[0], graphLines));
    }
    return i;

}


function getTruthVal(i, valuesTable, codeToParse, graphLines) {
    while (!graphLines[i].includes(']')) {
        i++;
    }
    let cond = graphLines[i].substring(0, graphLines[i].indexOf('",shape'));
    let codeLines = codeToParse.split((/\r?\n/));
    let val = false;
    for (var j = 0; j < codeLines.length; j++) {
        if (codeLines[j].includes('(' + cond + ')')) {
            for (var k = 0; k < valuesTable.length; k++) {
                val=checkVal(valuesTable,k,j,val);
            }
            break;
        }
    }
    return val;
}

function checkVal(valuesTable,k,j,val){
    if (valuesTable[k].Line === j + 1) {
        val = valuesTable[k].Condition;
    }
    return val;
}

function getLineOfNode(name, graphLines) {
    let ans = -1;
    for (var i = 0; i < graphLines.length; i++) {
        if (graphLines[i].startsWith(name) && graphLines[i].includes('label')) {
            ans = i;
            break;
        }
    }

    return ans;
}

function getPointTo(graphLines, name) {
    let pointTo = [];
    for (var i = 0; i < graphLines.length; i++) {
        if (graphLines[i].startsWith(name) && graphLines[i].includes('->')) {
            let node = graphLines[i].substring(graphLines[i].indexOf('>') + 2);
            node = node.substring(0, node.indexOf('['));
            pointTo.push(node);
        }
    }
    return pointTo;
}



function insertIndex(graph) {
    let graphLines = graph.split((/\r?\n/));
    let idx = 1;
    for (var i = 0; i < graphLines.length; i++) {
        if (!graphLines[i].includes('-> ') && graphLines[i].includes('label')) {
            graphLines[i] = graphLines[i].replace('label="', 'label="#' + idx + '\n');
            idx++;
        }

    }
    return graphLines.join('\n').replace(/(^[ \t]*\n)/gm, '');

}

function shapes(graph) {
    let graphLines = graph.split((/\r?\n/));
    for (var i = 0; i < graphLines.length; i++) {
        let conditions = ['<', '>', '!=', '&&', '||', '=='];
        let test = conditions.some(el => graphLines[i].includes(el));
        let start = graphLines[i].substring(0, graphLines[i].length - 1);
        graphLines[i]=getShape(test,i,start,graphLines);
        
    }
    return graphLines.join('\n').replace(/(^[ \t]*\n)/gm, '');
}

function getShape(test,i,start,graphLines){
    if (!test && graphLines[i] != '')//squre
    {
        graphLines[i] = start + ',shape=square]';
    }
    else if (!graphLines[i].includes('->') && graphLines[i] != '') {
        graphLines[i] = start + ',shape=diamond]';
    }
    return graphLines[i];
}

function mergeAss(graph) {
    let graphLines = graph.split((/\r?\n/));
    for (var i = 0; i < graphLines.length; i++) {
        if (checkIfAss(graphLines[i])) {
            if (checkIfAss(graphLines[i + 1])) {
                if (checkArrow(graphLines, i)) {
                    graphLines = merge2Lines(graphLines, i);//merge i&i+1
                    i--;
                }

            }


        }


    }
    return graphLines.join('\n').replace(/(^[ \t]*\n)/gm, '');

}

function checkArrow(graphLines, i) {
    let nodeName1 = graphLines[i].substring(0, graphLines[i].indexOf('['));
    let nodeName2 = graphLines[i + 1].substring(0, graphLines[i + 1].indexOf('['));

    let count = 0;
    let flag = false;
    for (var j = 0; j < graphLines.length; j++) {
        flag=checkArrowFromTo(graphLines,j,nodeName1,nodeName2,flag);
        if (graphLines[j].includes('-> ' + nodeName2)) {
            count++;
        }
    }
    if (flag && count == 1)
        return true;
    return false;
}

function checkArrowFromTo(graphLines,j,nodeName1,nodeName2,flag){
    if (graphLines[j].includes(nodeName1 + '-> ' + nodeName2)) {
        flag = true;
    }
    return flag;
}

function merge2Lines(graphLines, i) {
    let nodeName1 = graphLines[i].substring(0, graphLines[i].indexOf('['));
    let nodeName2 = graphLines[i + 1].substring(0, graphLines[i + 1].indexOf('['));

    //get label of node2
    let part1 = graphLines[i + 1].substring(graphLines[i + 1].indexOf('"') + 1);

    let label2 = part1.substring(0, part1.length - 15);
    //get node1 untill the place to insert the second- before "]
    let node1 = graphLines[i].substring(0, graphLines[i].length - 15);
    let newNode1 = node1 + '\n' + label2 + '",shape=square]';

    graphLines[i] = newNode1;
    graphLines[i + 1] = '';
    //arrange arrows- replace places that (nodeName2 ->) with nodeName1, and delete nodeName1 -> nodeName2
    graphLines = arrangeArrows(graphLines, nodeName1, nodeName2);
    return graphLines.filter(Boolean);
}

function arrangeArrows(graphLines, nodeName1, nodeName2) {
    //arrange arrows- replace places that (nodeName2 ->) with nodeName1, and delete nodeName1 -> nodeName2
    for (var i = 0; i < graphLines.length; i++) {
        if (!checkIfAss(graphLines[i]))//arrows row
        {

            if (graphLines[i].includes(nodeName1 + '-> ' + nodeName2))
                graphLines[i] = '';
            graphLines[i] = graphLines[i].replace(nodeName2 + '-> ', nodeName1 + '-> ');
        }
    }
    return graphLines.filter(Boolean);
}


function checkIfAss(line) {

    var conditions = ['=', 'label', '++', '--'];
    var test = conditions.some(el => line.includes(el));
    if (test) {
        conditions = ['<', '>', '!=', '&&', '||', '==', 'return'];
        test = conditions.some(el => line.includes(el));
        if (!test) {
            return true;
        }


    }
    return false;
}


export { getGraphCode, parseCode };