import $ from 'jquery';
import Viz from 'viz.js';
import { Module, render } from 'viz.js/full.render.js';
import {getGraphCode} from './graphs';



$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();  
        let args=$('#argumentsPlaceholder').val();
        let graph=getGraphCode(args,codeToParse);
        var viz = new Viz({ Module, render });
        viz.renderSVGElement('digraph {' +graph+'}')
            .then(function(element) {
                document.body.appendChild(element);
            });
    });
});
