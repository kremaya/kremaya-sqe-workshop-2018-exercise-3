import assert from 'assert';
import {getCode,getCode2} from '../src/js/submit-code';


describe('Test Statements', () => {



    it('is processing simple if statement', () => {
        assert.equal(
            JSON.stringify(getCode('function f(){\nif(\'m\'==\'m\'){}}',[])),
            JSON.stringify('function f(){<br/>\n<mark style="background-color:green;">if((\'m\'==\'m\')){</mark><br/>\n')
        );
    });

    it('is processing simple true if statement with args', () => {
        assert.equal(
            JSON.stringify(getCode('function f(x){\nlet a=\'maya\';\nif(a==x){}\n}',['\'maya\''])),
            JSON.stringify('function f(x){<br/>\n<mark style="background-color:green;">if(((\'maya\')==x)){</mark><br/>\n}<br/>\n')
        );
    });

    it('is processing simple false if statement with args', () => {
        assert.equal(
            JSON.stringify(getCode('function f(x){\nlet a=\'m\';\nif(a==x){}\n}',['\'maya\''])),
            JSON.stringify('function f(x){<br/>\n<mark style="background-color:red;">if(((\'m\')==x)){</mark><br/>\n}<br/>\n')
        );
    });

    it('is processing simple if statement with array', () => {
        assert.equal(
            JSON.stringify(getCode('let a=[\'b\',\'a\'];\nif(a[0]==\'b\'){}',[])),
            JSON.stringify('<mark style="background-color:green;">if((([\'b\',\'a\'])[0]==\'b\')){</mark><br/>\n')
        );
    });

    it('is processing simple while statement', () => {
        assert.equal(
            JSON.stringify(getCode('while(true){}',[])),
            JSON.stringify('while((true)){<br/>\n')
        );
    });
    it('is processing simple while statement2', () => {
        assert.equal(
            JSON.stringify(getCode('while(true)\n{}',[])),
            JSON.stringify('while((true))<br/>\n{}<br/>\n')
        );
    });

    it('is processing complex while statement', () => {
        assert.equal(
            JSON.stringify(getCode('while(true){\nif(false){\n}\n}',[])),
            JSON.stringify('while((true)){<br/>\n<mark style="background-color:red;">if((false)){</mark><br/>\n}<br/>\n}<br/>\n')
        );
    });

    it('is processing complex if with while', () => {
        assert.equal(
            JSON.stringify(getCode('if(true){\nwhile(false){\na=3;\n}\n}',[])),
            JSON.stringify('<mark style="background-color:green;">if((true)){</mark><br/>\nwhile((false)){<br/>\n}<br/>\n}<br/>\n')
        );
    });


    it('is processing complex if with while2', () => {
        assert.equal(
            JSON.stringify(getCode('function f(){\nif(true){\na=3;\nwhile(a<3){\n}\nreturn a;\n}\n}',[])),
            JSON.stringify('function f(){<br/>\n<mark style="background-color:green;">if((true)){</mark><br/>\nwhile(((3)<3)){<br/>\n}<br/>\nreturn ((3));<br/>\n}<br/>\n}<br/>\n')
        );
    });

    it('is processing complex if inside if', () => {
        assert.equal(
            JSON.stringify(getCode('if(true){\nif(false){\n}\nif(true){\n}\n}',[])),
            JSON.stringify('<mark style="background-color:green;">if((true)){</mark><br/>\n<mark style="background-color:red;">if((false)){</mark><br/>\n}<br/>\n<mark style="background-color:green;">if((true)){</mark><br/>\n}<br/>\n}<br/>\n')
        );
    });

    it('is processing complex if with another if', () => {
        assert.equal(
            JSON.stringify(getCode('if(true){\nlet a=3;\nif(a>2){\n}\n}',[])),
            JSON.stringify('<mark style="background-color:green;">if((true)){</mark><br/>\n<mark style="background-color:green;">if(((3)>2)){</mark><br/>\n}<br/>\n}<br/>\n')
        );
    });

    it('is processing while statement with if after', () => {
        assert.equal(
            JSON.stringify(getCode('while(true){\n}\nif(false){\n}',[])),
            JSON.stringify('while((true)){<br/>\n}<br/>\n<mark style="background-color:red;">if((false)){</mark><br/>\n}<br/>\n')
        );
    });

 
    it('is processing simple return statement', () => {
        assert.equal(
            JSON.stringify(getCode('function f(){\nreturn 3;\n}',[])),
            JSON.stringify('function f(){<br/>\nreturn (3);<br/>\n}<br/>\n')
        );
    });

    it('is processing simple binary return statement', () => {
        assert.equal(
            JSON.stringify(getCode('function f(){\nreturn 2+3;\n}',[])),
            JSON.stringify('function f(){<br/>\nreturn (2+3);<br/>\n}<br/>\n')
        );
    });

    it('is processing simple else if statement', () => {
        assert.equal(
            JSON.stringify(getCode('if(true){}\nelse if(true){}',[])),
            JSON.stringify('<mark style="background-color:green;">if((true)){</mark><br/>\n<mark style="background-color:green;">}else if((true)){</mark><br/>\n')
        );
    });


    it('is processing if, elseif, else ', () => {
        assert.equal(
            JSON.stringify(getCode('if(true)\n{}\nelse if(true)\n{}\nelse\n{}',[])),
            JSON.stringify('<mark style="background-color:green;">if((true))</mark><br/>\n{}<br/>\n<mark style="background-color:green;">else if((true))</mark><br/>\n{}<br/>\nelse<br/>\n{}<br/>\n')
        );
    });

    it('is processing if, elseif, else2 ', () => {
        assert.equal(
            JSON.stringify(getCode('if(true){\n}\nelse if(true){\n}\nelse{\n}',[])),
            JSON.stringify('<mark style="background-color:green;">if((true)){</mark><br/>\n}<br/>\n<mark style="background-color:green;">else if((true)){</mark><br/>\n}else<br/>\nelse{<br/>\n}<br/>\n')
        );
    });

    it('is processing if, elseif, else2 ', () => {
        assert.equal(
            JSON.stringify(getCode('if(true){\n}else if(true){\n}else{}',[])),
            JSON.stringify('<mark style="background-color:green;">if((true)){</mark><br/>\n<mark style="background-color:green;">}else{</mark><br/>\n}else{}<br/>\n')
        );
    });

    it('is processing if, elseif, else3 ', () => {
        assert.equal(
            JSON.stringify(getCode('if(true){\n}else if(true)\n{}\nelse{\n}',[])),
            JSON.stringify('<mark style="background-color:green;">if((true)){</mark><br/>\n<mark style="background-color:green;">}else if((true))</mark><br/>\n}else{<br/>\nelse{<br/>\n}<br/>\n')
        );
    });

    it('is processing simple return statement  ', () => {
        assert.equal(
            JSON.stringify(getCode('function f(){\nlet a=5;\nreturn -3+2;\n}',[])),
            JSON.stringify('function f(){<br/>\nreturn (-3+2);<br/>\n}<br/>\n')
        );
    });
  
    

});

describe('Test Declerations', () => {

    it('is processing binary decleration', () => {
        assert.equal(
            JSON.stringify(getCode('let i=1+2;',[])),
            JSON.stringify('')
        );
    });
    
    it('is processing simple assignment', () => {
        assert.equal(
            JSON.stringify(getCode('a=3;',[])),
            JSON.stringify('')
        );
    });

    it('is processing arg assignment', () => {
        assert.equal(
            JSON.stringify(getCode('function f(x){\nx=3;\n}',[1])),
            JSON.stringify('function f(x){<br/>\nx=(3);<br/>\n}<br/>\n')
        );
    });

    it('is processing 2 declerations', () => {
        assert.equal(
            JSON.stringify(getCode('let a=3;\nlet b=a+6;\nif(b<5){\n}',[])),
            JSON.stringify('<mark style="background-color:red;">if((((3)+6)< 5)){</mark><br/>\n}<br/>\n')
        );
    });

    it('is processing 2 assignments to same var', () => {
        assert.equal(
            JSON.stringify(getCode('let a=3;\na=5;',[])),
            JSON.stringify('')
        );
    });

    it('is processing code2', () => {
        assert.equal(
            JSON.stringify(getCode2('function f(){\nif(3+1==4){\nreturn 1;\n}\n}',[])),
            JSON.stringify([{"Line":1,"Type":"Function Declaration","Name":"f","Condition":null,"Value":null},{"Line":2,"Type":"If Statement","Name":null,"Condition":"true","Value":null,"End":4},{"Line":3,"Type":"Return Statment","Name":null,"Condition":null,"Value":"(1)"}])
        );
    });

    it('is processing code2 false', () => {
        assert.equal(
            JSON.stringify(getCode2('function f(){\nif(3+1==5){\nreturn 1;\n}\n}',[])),
            JSON.stringify([{"Line":1,"Type":"Function Declaration","Name":"f","Condition":null,"Value":null},{"Line":2,"Type":"If Statement","Name":null,"Condition":"false","Value":null,"End":4},{"Line":3,"Type":"Return Statment","Name":null,"Condition":null,"Value":"(1)"}])
        );
    });

});

describe('Test Arguments', () => {

    it('is processing array arg', () => {
        assert.equal(
            JSON.stringify(getCode('function f(x){\nif(x[0]==\'b\'){}\n}','[\'b\']')),
            JSON.stringify('function f(x){<br/>\n<mark style="background-color:green;">if((x[0]==\'b\')){</mark><br/>\n}<br/>\n')
        );
    });




});