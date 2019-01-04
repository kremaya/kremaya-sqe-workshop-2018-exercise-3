import assert from 'assert';
import { parseCode } from '../src/js/code-analyzer';
import { createArray, createTable } from '../src/js/table-creator';
import {getGraphCode } from '../src/js/graphs';



describe('Test Ifs', () => {

    

    
    it('is processing simple func with assigments inside if and outside', () => {
        assert.equal(
            JSON.stringify(getGraphCode([],'function f(){\nif(2==2){\na=5;\n}\na=6;\n}')),
            JSON.stringify('n1 [style=filled,color=green,label="#1\n2==2",shape=diamond]\nn2 [style=filled,color=green,label="#2\na=5",shape=square]\nn3 [style=filled,color=green,label="#3\na=6",shape=square]\nn1 -> n2 [label="T"]\nn1 -> pointTon3 [label="F"]\nn2 -> pointTon3 []\npointTon3 [label="",style=filled,color=lightgrey]\npointTon3  -> n3 []')
        );
    });


    it('is processing simple if true', () => {
        assert.equal(
            JSON.stringify(getGraphCode([],'function f(){\nif(2+1==3)\n{return 1;}\nreturn 2;\n}')),
            JSON.stringify('n1 [style=filled,color=green,label="#1\n2+1==3",shape=diamond]\nn2 [style=filled,color=green,label="#2\nreturn 1;",shape=square]\nn3 [label="#3\nreturn 2;",shape=square]\nn1 -> n2 [label="T"]\nn1 -> n3 [label="F"]\n')
        );
    });

    it('is processing simple if return', () => {
        assert.equal(
            JSON.stringify(getGraphCode([],'   function f(){\nif(2==3)\na=3;\nreturn 1;\n}')),
            JSON.stringify('n1 [style=filled,color=green,label="#1\n2==3",shape=diamond]\nn2 [label="#2\na=3",shape=square]\nn3 [style=filled,color=green,label="#3\nreturn 1;",shape=square]\nn1 -> n2 [label="T"]\nn1 -> pointTon3 [label="F"]\nn2 -> pointTon3 []\npointTon3 [label="",style=filled,color=lightgrey]\npointTon3  -> n3 []')
        );
    });

    it('is processing simple if false', () => {
        assert.equal(
            JSON.stringify(getGraphCode([],'function f(){\nif(2+1==1)\n{return 1;}\nreturn 2;\n}')),
            JSON.stringify('n1 [style=filled,color=green,label="#1\n2+1==1",shape=diamond]\nn2 [label="#2\nreturn 1;",shape=square]\nn3 [style=filled,color=green,label="#3\nreturn 2;",shape=square]\nn1 -> n2 [label="T"]\nn1 -> n3 [label="F"]\n')
        );
    });

    it('is processing simple if-true else', () => {
        assert.equal(
            JSON.stringify(getGraphCode([],'function f(){\nif(3==3)\na=2;\nelse\na=3;\nreturn a;}')),
            JSON.stringify('n1 [style=filled,color=green,label="#1\n3==3",shape=diamond]\nn2 [style=filled,color=green,label="#2\na=2",shape=square]\nn3 [style=filled,color=green,label="#3\nreturn a;",shape=square]\nn4 [label="#4\na=3",shape=square]\nn1 -> n2 [label="T"]\nn1 -> n4 [label="F"]\nn2 -> pointTon3 []\nn4 -> pointTon3 []\npointTon3 [label="",style=filled,color=lightgrey]\npointTon3  -> n3 []')
        );
    });

    
    it('is processing simple if-false else', () => {
        assert.equal(
            JSON.stringify(getGraphCode([],'function f(){\nif(3==2)\na=2;\nelse\na=3;\nreturn a;}')),
            JSON.stringify('n1 [style=filled,color=green,label="#1\n3==2",shape=diamond]\nn2 [label="#2\na=2",shape=square]\nn3 [style=filled,color=green,label="#3\nreturn a;",shape=square]\nn4 [style=filled,color=green,label="#4\na=3",shape=square]\nn1 -> n2 [label="T"]\nn1 -> n4 [label="F"]\nn2 -> pointTon3 []\nn4 -> pointTon3 []\npointTon3 [label="",style=filled,color=lightgrey]\npointTon3  -> n3 []')
        );
    });




});


describe('Test Whiles', () => {

    it('is processing simple true while', () => {
        assert.equal(
            JSON.stringify(getGraphCode([],'function f(){\na=2;\nwhile(a<3){\na++;\n}\nreturn a;\n}')),
            JSON.stringify('n1 [style=filled,color=green,label="#1\na=2",shape=square]\nn2 [style=filled,color=green,label="#2\na<3",shape=diamond]\nn3 [style=filled,color=green,label="#3\na++",shape=square]\nn4 [style=filled,color=green,label="#4\nreturn a;",shape=square]\nn1 -> pointTon2 []\nn2 -> n3 [label="T"]\nn2 -> n4 [label="F"]\nn3 -> pointTon2 []\npointTon2 [label="",style=filled,color=lightgrey]\npointTon2  -> n2 []')
        );
    });

    it('is processing simple false while', () => {
        assert.equal(
            JSON.stringify(getGraphCode([],'function f(){\na=2;\nwhile(a<2){\na++;\n}\nreturn a;\n}')),
            JSON.stringify('n1 [style=filled,color=green,label="#1\na=2",shape=square]\nn2 [style=filled,color=green,label="#2\na<2",shape=diamond]\nn3 [label="#3\na++",shape=square]\nn4 [style=filled,color=green,label="#4\nreturn a;",shape=square]\nn1 -> pointTon2 []\nn2 -> n3 [label="T"]\nn2 -> n4 [label="F"]\nn3 -> pointTon2 []\npointTon2 [label="",style=filled,color=lightgrey]\npointTon2  -> n2 []')
        );
    });




});


describe('Test function', () => {

    it('is processing simple func with many assigments', () => {
        assert.equal(
            JSON.stringify(getGraphCode([],'function f(){a=3;\na=4;\nreturn 1;\n}')),
            JSON.stringify('n1 [style=filled,color=green,label="#1\na=3\na=4",shape=square]\nn3 [style=filled,color=green,label="#2\nreturn 1;",shape=square]\nn1 -> n3 []')
        );
    });



    



});

