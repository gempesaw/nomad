document.addEventListener("turbolinks:load",function(){analytics.page(),track(".downloads .download .details li a",function(a){var o=a.href.match(/nomad_(.*?)_(.*?)_(.*?)\.zip/);return{event:"Download",category:"Button",label:"Nomad | v"+o[1]+" | "+o[2]+" | "+o[3],version:o[1],os:o[2],architecture:o[3],product:"nomad"}})});