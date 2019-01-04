
var arr = [];

function createArray(parsedCode) {
    arr = [];
    rec(parsedCode.body);
    return arr;
}


function createTable(arr) {

    let rows;
    rows = '<tr><th>Line</th><th>Type</th><th>Name</th><th>Condition</th><th>Value</th></tr>';
    for (var i = 0; i < arr.length; i++) {
        rows = rows + '<tr><td>' + arr[i].Line + '</td><td>' + arr[i].Type + '</td><td>' + arr[i].Name + '</td><td>' + JSON.stringify(arr[i].Condition).replace('<',' < ') + '</td><td>' + arr[i].Value + '</td></tr>';
    }
    return rows;

}

function rec(object) {
    for (var i = 0; i < object.length; i++) {
        if (object[i].type === 'FunctionDeclaration') {
            funcdec(object[i]);}
        else if (object[i].type === 'BlockStatement') {
            blockSt(object[i]);}
        else if (object[i].type === 'VariableDeclaration') {
            varDec(object[i].declarations);}
        else
            rec2(object,i);
    }
}
function rec2(object,i){
    if (object[i].type === 'WhileStatement') {
        whileSt(object[i]);}
    else if (object[i].type === 'ExpressionStatement') {
        exp(object[i].expression);}
    else if (object[i].type === 'IfStatement') {
        ifSt(object[i]);}
    else if (object[i].type === 'ReturnStatement') {
        retrSt(object[i]);}
    else 
        forSt(object[i]);
}

function funcdec(object) {
    let jsonObj = { 'Line': object.loc.start.line, 'Type': 'Function Declaration', 'Name': object.id.name, 'Condition': null, 'Value': null };
    arr.push(jsonObj);
    params(object.params);
    rec(object.body.body);


}

function params(object) {

    for (var i = 0; i < object.length; i++) {
        let jsonObj = { 'Line': object[i].loc.start.line, 'Type': 'Argument Declaration', 'Name': object[i].name, 'Condition': null, 'Value': null };
        arr.push(jsonObj);
    }

}

function varDec(object) {
    for (var i = 0; i < object.length; i++) {
        let val = null;
        if (object[i].init != null) {
            val=getVal(object[i].init);
        }
        let jsonObj = { 'Line': object[i].loc.start.line, 'Type': 'Variable Declaration', 'Name': object[i].id.name, 'Condition': null, 'Value': val };
        arr.push(jsonObj);
    }
}

function getVal(object){
    if (object.type === 'Literal')
        return object.raw;
    else if (object.type === 'Identifier')
        return object.name;
    else if (object.type === 'MemberExpression')
        return member(object);
    else if(object.type === 'UnaryExpression')
        return unaryExp(object);
    return checkarrayOrBinary(object);

}

function checkarrayOrBinary(object){
    if(object.type=='ArrayExpression')
        return arrayExp(object);
    return binaryExp(object);
}

function arrayExp(object){
    let val='[';
    for(var i=0; i<object.elements.length; i++){
        if(i>0)
            val=val+','+getVal(object.elements[i]);
        else
            val=val+getVal(object.elements[i]);
    }
    val=val+']';
    return val;

}




function blockSt(object) {
    rec(object.body);
}


function exp(object) {
    if(object.type==='UpdateExpression'){
        upd(object);
        return;}    
    let expr, left;
    if (object.right.type === 'BinaryExpression') {
        expr = binaryExp(object.right);}
    else {
        expr=notBinary(object);}
    if (object.left.type === 'MemberExpression')
        left = member(object.left);
    else
        left = object.left.name;
    let jsonObj = { 'Line': object.loc.start.line, 'Type': 'Assignment Expression', 'Name': left, 'Condition': null, 'Value': expr };
    arr.push(jsonObj);}


function notBinary(object){
    if (object.right.type === 'MemberExpression')
        return member(object.right);
    else if (object.right.type === 'Literal')
        return object.right.raw;
    else if (object.right.type === 'ArrayExpression')
        return arrayExp(object.right);
    else
        return object.right.name;
}

function upd(object){
    let val=null;
    if(object.prefix===true)
        val=object.operator+object.argument.name;
    else
        val=object.argument.name+object.operator;
    let jsonObj = { 'Line': object.loc.start.line, 'Type': 'Update Expression', 'Name': null, 'Condition': null, 'Value': val};
    arr.push(jsonObj);
}

function forSt(object) {
    let expr = binaryExp(object.test);
    let jsonObj = { 'Line': object.loc.start.line, 'Type': 'For Statement', 'Name': null, 'Condition': expr, 'Value': null };
    arr.push(jsonObj);
    if(object.init.type==='VariableDeclaration')
    {
        varDec(object.init.declarations);
    }
        
    else
    {
        exp(object.init);
    }
       
    exp(object.update);
    blockSt(object.body);
}


function whileSt(object) {
    test(object.test, 'While Statement',object.loc.end.line);
    rec(object.body.body);

}

function checkUnary(object){
    if (object.type === 'UnaryExpression')
        return unaryExp(object);
    return '';
}

function test(object, statement,end) {
    let expr;
    expr=checkUnary(object);
    if (object.type === 'BinaryExpression'||object.type==='LogicalExpression')
        expr = binaryExp(object);
    if (object.type === 'Identifier')
        expr = object.name;
    if (object.type === 'Literal')
        expr =object.raw;
    let jsonObj = { 'Line': object.loc.start.line, 'Type': statement, 'Name': null, 'Condition': expr, 'Value': null , 'End': end};
    arr.push(jsonObj);
}


function binaryExp(object) {
    let left;
    if (object.left.type === 'BinaryExpression'||object.left.type === 'LogicalExpression') {left = '(' + binaryExp(object.left) + ')';}
    else {
        left=getLeft(object);}
    if (object.right.type === 'BinaryExpression'||object.left.type === 'LogicalExpression') {
        return left + object.operator+ '(' + binaryExp(object.right) + ')';}
    return binaryExpifs(object,left);
}

function binaryExpifs(object,left){
    if (object.right.type === 'Identifier')
        return left + object.operator+ object.right.name;
    else if (object.right.type === 'MemberExpression') {
        return left + object.operator+ member(object.right);}
    else if (object.right.type === 'UnaryExpression') {
        return left + object.operator+ unaryExp(object.right);}
    else if (object.right.type === 'ArrayExpression') {
        return left + object.operator+ arrayExp(object.right);}
    return checkLiteral(object,left);
}

function checkLiteral(object,left){
    if (object.right.type === 'Literal') {
        return left + object.operator+object.right.raw;}
    return left + object.operator+ object.right.value;
}
function getLeft(object){
    if (object.left.type === 'Identifier')
        return object.left.name;
    else if (object.left.type === 'MemberExpression') {
        return member(object.left);}
    else if (object.left.type === 'Literal') {
        return object.left.raw;}
    else if(object.left.type === 'UnaryExpression')
        return unaryExp(object.left);
    return checkarray(object);
}

function checkarray(object){
    if (object.left.type === 'ArrayExpression')
        return arrayExp(object.left);
    return object.left.value;
}

function ifSt(object) {
    test(object.test, 'If Statement',object.consequent.loc.end.line);
    let array = [];
    array.push(object.consequent);
    rec(array);
    if (object.alternate != null)
        elseifSt(object.alternate);

}

function elseifSt(object) {
    if (object.type != 'IfStatement') {
        elseSt(object);
        let array = [];
        array.push(object);
        rec(array);
        return;
    }
    test(object.test, 'Else If Statement',object.consequent.loc.end.line);
    let array = [];
    array.push(object.consequent);
    rec(array);
    if (object.alternate != null)
        elseifSt(object.alternate);
}

function elseSt(object) {
    let jsonObj = { 'Line': object.loc.start.line-1, 'Type': 'Else Statment', 'Name': null, 'Condition': null, 'Value': null };
    arr.push(jsonObj);
}

function retrSt(object) {
    if (object.argument.type === 'Identifier') {
        let jsonObj = { 'Line': object.loc.start.line, 'Type': 'Return Statment', 'Name': null, 'Condition': null, 'Value': object.argument.name };
        arr.push(jsonObj); }
    else if (object.argument.type === 'BinaryExpression') {
        let exp = binaryExp(object.argument);
        let jsonObj = { 'Line': object.loc.start.line, 'Type': 'Return Statment', 'Name': null, 'Condition': null, 'Value': exp };
        arr.push(jsonObj);}
    else if (object.argument.type === 'UnaryExpression') {
        let exp = unaryExp(object.argument);
        let jsonObj = { 'Line': object.loc.start.line, 'Type': 'Return Statment', 'Name': null, 'Condition': null, 'Value': exp };
        arr.push(jsonObj);}
    else if(object.argument.type === 'MemberExpression'){
        let exp = member(object.argument);
        let jsonObj = { 'Line': object.loc.start.line, 'Type': 'Return Statment', 'Name': null, 'Condition': null, 'Value': exp };
        arr.push(jsonObj);
    }else {
        let exp = object.argument.raw;
        let jsonObj = { 'Line': object.loc.start.line, 'Type': 'Return Statment', 'Name': null, 'Condition': null, 'Value': exp };
        arr.push(jsonObj);}}

function unaryExp(object) {
    if(object.argument.type==='Identifier')
        return object.operator + object.argument.name;
    if (object.argument.type === 'UnaryExpression')
        return object.operator +unaryExp(object.argument);
    if (object.argument.type === 'BinaryExpression'||object.argument.type==='LogicalExpression')
        return object.operator+'(' +binaryExp(object.argument)+')';
    return checkunary(object);
}

function checkunary(object){
    if (object.argument.type === 'Literal')
        return object.operator +object.argument.raw;
    return object.operator + object.argument.value;
}

function member(object) {
    if(object.computed==false)
        return object.object.name + '.' + object.property.name;
    if (object.property.type === 'BinaryExpression')
        return object.object.name + '[' + binaryExp(object.property) + ']';
    if (object.property.type === 'Literal')
        return object.object.name + '[' + object.property.raw +']';
    else
        return object.object.name + '[' + object.property.name + ']';


}
export { createArray, createTable };