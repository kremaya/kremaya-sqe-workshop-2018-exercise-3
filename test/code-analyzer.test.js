import assert from 'assert';
import { parseCode } from '../src/js/code-analyzer';
import { createArray, createTable } from '../src/js/table-creator';

describe('Test Empty Input', () => {
    it('is processing empty input correctly', () => {
        assert.equal(
            JSON.stringify(createArray(parseCode(''))),
            JSON.stringify([])
        );
    });

});

describe('Test Declerations', () => {
    it('is processing decleration+init correctly', () => {
        assert.equal(
            JSON.stringify(createArray(parseCode('let i=1;'))),
            JSON.stringify([{ "Line": 1, "Type": "Variable Declaration", "Name": "i", "Condition": null, "Value": "1" }])
        );
    });

    it('is processing array decleration', () => {
        assert.equal(
            JSON.stringify(createArray(parseCode('let a=[-2];'))),
            JSON.stringify([{"Line":1,"Type":"Variable Declaration","Name":"a","Condition":null,"Value":"[-2]"}])
        );
    });

    it('is processing declerations', () => {
        assert.equal(
            JSON.stringify(createArray(parseCode('let a=-(-3);\nlet a=-(3+2);'))),
            JSON.stringify([{"Line":1,"Type":"Variable Declaration","Name":"a","Condition":null,"Value":"--3"},{"Line":2,"Type":"Variable Declaration","Name":"a","Condition":null,"Value":"-(3+2)"}])
        );
    });



    it('is processing array assignment', () => {
        assert.equal(
            JSON.stringify(createArray(parseCode('a=[\'a\'];'))),
            JSON.stringify([{"Line":1,"Type":"Assignment Expression","Name":"a","Condition":null,"Value":"['a']"}])
        );
    });


    it('is processing simple decleration correctly', () => {
        assert.equal(
            JSON.stringify(createArray(parseCode('let i;'))),
            JSON.stringify([{ "Line": 1, "Type": "Variable Declaration", "Name": "i", "Condition": null, "Value": null }])
        );
    });

    it('is processing complex variable decleration correctly', () => {
        assert.equal(
            JSON.stringify(createArray(parseCode('let i=x;\nlet j=a[2];\nlet k=2+3;'))),
            JSON.stringify([{"Line":1,"Type":"Variable Declaration","Name":"i","Condition":null,"Value":"x"},{"Line":2,"Type":"Variable Declaration","Name":"j","Condition":null,"Value":"a[2]"},{"Line":3,"Type":"Variable Declaration","Name":"k","Condition":null,"Value":"2+3"}])
        );
    });

});

describe('Test Table', () => {
    it('is building table rows correctly', () => {
        assert.equal(
            createTable(createArray(parseCode('i=2;'))),
            "<tr><th>Line</th><th>Type</th><th>Name</th><th>Condition</th><th>Value</th></tr><tr><td>1</td><td>Assignment Expression</td><td>i</td><td>null</td><td>2</td></tr>"
        );
    });
});

describe('Test Expressions', () =>{
    it('is processing left and right side member expression correctly', () => {
        assert.equal(
            JSON.stringify(createArray(parseCode('a[x]=2;\nx=a[0];'))),
            JSON.stringify([{"Line":1,"Type":"Assignment Expression","Name":"a[x]","Condition":null,"Value":"2"},{"Line":2,"Type":"Assignment Expression","Name":"x","Condition":null,"Value":"a[0]"}])
        );
    });

    it('is processing update expression correctly', () => {
        assert.equal(
            JSON.stringify(createArray(parseCode('i++;'))),
            JSON.stringify([{"Line":1,"Type":"Update Expression","Name":null,"Condition":null,"Value":"i++"}])
        );
    });

    it('is processing update expression with prefix correctly', () => {
        assert.equal(
            JSON.stringify(createArray(parseCode('++i;'))),
            JSON.stringify([{"Line":1,"Type":"Update Expression","Name":null,"Condition":null,"Value":"++i"}])
        );
    });

    it('is processing identifier init correctly', () => {
        assert.equal(
            JSON.stringify(createArray(parseCode('i=x;'))),
            JSON.stringify([{ "Line": 1, "Type": "Assignment Expression", "Name": "i", "Condition": null, "Value": "x" }])
        );
    });

    it('is processing complex binary expression correctly', () => {
        assert.equal(
            JSON.stringify(createArray(parseCode('let x=[2,3];\nif(x[3]+((x+3)-(2*3))+x){}'))),
            JSON.stringify([{"Line":1,"Type":"Variable Declaration","Name":"x","Condition":null,"Value":"[2,3]"},{"Line":2,"Type":"If Statement","Name":null,"Condition":"(x[3]+((x+3)-(2*3)))+x","Value":null,"End":2}])
        );
    });

    it('is processing member expression correctly', () => {
        assert.equal(
            JSON.stringify(createArray(parseCode('let x=[3];\nif (2<x[1]){}'))),
            JSON.stringify([{"Line":1,"Type":"Variable Declaration","Name":"x","Condition":null,"Value":"[3]"},{ "Line": 2, "Type": "If Statement", "Name": null, "Condition": "2<x[1]", "Value": null, "End":2 }])
        );
    });

    it('is processing unary expression correctly', () => {
        assert.equal(
            JSON.stringify(createArray(parseCode('function f(){\nreturn -1;}'))),
            JSON.stringify([{ "Line": 1, "Type": "Function Declaration", "Name": "f", "Condition": null, "Value": null }, { "Line": 2, "Type": "Return Statment", "Name": null, "Condition": null, "Value": "-1" }])
        );
    });

    it('is processing binary expression in return statement correctly', () => {
        assert.equal(
            JSON.stringify(createArray(parseCode('function f(){\nreturn 1+3;}'))),
            JSON.stringify([{ "Line": 1, "Type": "Function Declaration", "Name": "f", "Condition": null, "Value": null }, { "Line": 2, "Type": "Return Statment", "Name": null, "Condition": null, "Value": "1+3" }])
        );
    });

    it('is processing complex member expression correctly', () => {
        assert.equal(
            JSON.stringify(createArray(parseCode('x[2+3]=0;'))),
            JSON.stringify([{"Line":1,"Type":"Assignment Expression","Name":"x[2+3]","Condition":null,"Value":"0"}])
        );
    });
});

describe('Test Functions', () => {
    it('is processing function correctly', () => {
        assert.equal(
            JSON.stringify(createArray(parseCode('function f(x){}'))),
            JSON.stringify([{"Line":1,"Type":"Function Declaration","Name":"f","Condition":null,"Value":null},{"Line":1,"Type":"Argument Declaration","Name":"x","Condition":null,"Value":null}])
        );
    });

    it('is processing parameters correctly', () => {
        assert.equal(
            JSON.stringify(createArray(parseCode('function f(x){\nreturn 1;}'))),
            JSON.stringify([{"Line":1,"Type":"Function Declaration","Name":"f","Condition":null,"Value":null},{"Line":1,"Type":"Argument Declaration","Name":"x","Condition":null,"Value":null},{"Line":2,"Type":"Return Statment","Name":null,"Condition":null,"Value":"1"}])
        );
    });
});

describe('Test Statements', () => {
    it('is processing if statement+binary statemant correctly', () => {
        assert.equal(
            JSON.stringify(createArray(parseCode('if(i<2){}'))),
            JSON.stringify([{"Line":1,"Type":"If Statement","Name":null,"Condition":"i<2","Value":null,"End":1}])
        );
    });

    it('is processing for statment correctly', () => {
        assert.equal(
            JSON.stringify(createArray(parseCode('for(let i=0; i<2; i=i+2){}'))),
            JSON.stringify([{"Line":1,"Type":"For Statement","Name":null,"Condition":"i<2","Value":null},{"Line":1,"Type":"Variable Declaration","Name":"i","Condition":null,"Value":"0"},{"Line":1,"Type":"Assignment Expression","Name":"i","Condition":null,"Value":"i+2"}])
        );
    });

    it('is processing if statment correctly2', () => {
        assert.equal(
            JSON.stringify(createArray(parseCode('if(3<-2){\n}\nif([\'a\']==[\'a\']){\n}'))),
            JSON.stringify([{"Line":1,"Type":"If Statement","Name":null,"Condition":"3<-2","Value":null,"End":2},{"Line":3,"Type":"If Statement","Name":null,"Condition":"['a']==['a']","Value":null,"End":4}])
        );
    });

    it('is processing if statment correctly3', () => {
        assert.equal(
            JSON.stringify(createArray(parseCode('let flag=true;\nif(flag){}'))),
            JSON.stringify([{"Line":1,"Type":"Variable Declaration","Name":"flag","Condition":null,"Value":"true"},{"Line":2,"Type":"If Statement","Name":null,"Condition":"flag","Value":null,"End":2}])
        );
    });

    it('is processing if statment correctly4', () => {
        assert.equal(
            JSON.stringify(createArray(parseCode('let flag=true;\nif(!flag){}'))),
            JSON.stringify([{"Line":1,"Type":"Variable Declaration","Name":"flag","Condition":null,"Value":"true"},{"Line":2,"Type":"If Statement","Name":null,"Condition":"!flag","Value":null,"End":2}])
        );
    });

 

    it('is processing for statment with non computer member expression correctly', () => {
        assert.equal(
            JSON.stringify(createArray(parseCode('for(var i=0; i<arr.length; i++){}'))),
            JSON.stringify([{"Line":1,"Type":"For Statement","Name":null,"Condition":"i<arr.length","Value":null},{"Line":1,"Type":"Variable Declaration","Name":"i","Condition":null,"Value":"0"},{"Line":1,"Type":"Update Expression","Name":null,"Condition":null,"Value":"i++"}])
        );
    });


    it('is processing for statment without declaration correctly', () => {
        assert.equal(
            JSON.stringify(createArray(parseCode('for(i=0; i<2; i=i+2){}'))),
            JSON.stringify([{"Line":1,"Type":"For Statement","Name":null,"Condition":"i<2","Value":null},{"Line":1,"Type":"Assignment Expression","Name":"i","Condition":null,"Value":"0"},{"Line":1,"Type":"Assignment Expression","Name":"i","Condition":null,"Value":"i+2"}])
        );
    });

    it('is processing while statement correctly', () => {
        assert.equal(
            JSON.stringify(createArray(parseCode('while(true){}'))),
            JSON.stringify([{"Line":1,"Type":"While Statement","Name":null,"Condition":"true","Value":null,"End":1}])
        );
    });

    it('is processing return statement correctly', () => {
        assert.equal(
            JSON.stringify(createArray(parseCode('function f(){\nreturn 1;}'))),
            JSON.stringify([{ "Line": 1, "Type": "Function Declaration", "Name": "f", "Condition": null, "Value": null }, { "Line": 2, "Type": "Return Statment", "Name": null, "Condition": null, "Value": "1" }])
        );
    });

    it('is processing return statement  with member correctly', () => {
        assert.equal(
            JSON.stringify(createArray(parseCode('function f(){\nreturn a[2];\n}'))),
            JSON.stringify([{"Line":1,"Type":"Function Declaration","Name":"f","Condition":null,"Value":null},{"Line":2,"Type":"Return Statment","Name":null,"Condition":null,"Value":"a[2]"}])
        );
    });

    it('is processing else statement correctly', () => {
        assert.equal(
            JSON.stringify(createArray(parseCode('if (i==3)\ni=2;\nelse\ni=1;'))),
            JSON.stringify([{"Line":1,"Type":"If Statement","Name":null,"Condition":"i==3","Value":null,"End":2},{"Line":2,"Type":"Assignment Expression","Name":"i","Condition":null,"Value":"2"},{"Line":3,"Type":"Else Statment","Name":null,"Condition":null,"Value":null},{"Line":4,"Type":"Assignment Expression","Name":"i","Condition":null,"Value":"1"}])
        );
    });

    it('is processing else-if statement correctly', () => {
        assert.equal(
            JSON.stringify(createArray(parseCode('if(true)\ni=2;\nelse if(false)\ni=3;'))),
            JSON.stringify(
                [{"Line":1,"Type":"If Statement","Name":null,"Condition":"true","Value":null,"End":2},{"Line":2,"Type":"Assignment Expression","Name":"i","Condition":null,"Value":"2"},{"Line":3,"Type":"Else If Statement","Name":null,"Condition":"false","Value":null,"End":4},{"Line":4,"Type":"Assignment Expression","Name":"i","Condition":null,"Value":"3"}])
        );
    });

    it('is processing many else statments correctly', () => {
        assert.equal(
            JSON.stringify(createArray(parseCode('a=3;\nif(a==2)\na=1;\nelse if(a==3)\na=2;\nelse\na=1;'))),
            JSON.stringify([{"Line":1,"Type":"Assignment Expression","Name":"a","Condition":null,"Value":"3"},{"Line":2,"Type":"If Statement","Name":null,"Condition":"a==2","Value":null,"End":3},{"Line":3,"Type":"Assignment Expression","Name":"a","Condition":null,"Value":"1"},{"Line":4,"Type":"Else If Statement","Name":null,"Condition":"a==3","Value":null,"End":5},{"Line":5,"Type":"Assignment Expression","Name":"a","Condition":null,"Value":"2"},{"Line":6,"Type":"Else Statment","Name":null,"Condition":null,"Value":null},{"Line":7,"Type":"Assignment Expression","Name":"a","Condition":null,"Value":"1"}])
        );
    });
});