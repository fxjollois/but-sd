/*global d3,location,marked*/
/*eslint-env es6*/

function lien(info) {
    'use strict';
    var url = location.origin + location.pathname + "?semestre=" + info.semestre;
    if (info.codeSAE) {
        url += "&SAE=" + info.codeSAE;
    } else {
        url += "&ressource=" + info["@code"];
    }
    return (url);
}

function remplir_sae(sae) {
    'use strict';
    d3.select("#liste_sae").append("ul").attr("class", "nav nav-pills").selectAll("li")
        .data(sae)
        .enter()
        .append("li")
        .attr("class", "nav-item")
        .append("a")
        .attr("class", "nav-link")
        .attr("href", lien)
        .html(d => d["@code"]);
}
function remplir_res (res) {
    'use strict';
    d3.select("#liste_res").append("ul").attr("class", "nav nav-pills").selectAll("li")
        .data(res)
        .enter()
        .append("li")
        .attr("class", "nav-item")
        .append("a")
        .attr("class", "nav-link")
        .attr("href", lien)
        .html((d) => d["@code"])
        // .on("click", choix_fiche_res);
}


function affiche_SAE (args, acs, res) {
    'use strict';
    var liste_sae = d3.select("#liste_sae").selectAll("li"),
        info = liste_sae.data().filter((e) => e["code_"] == args.SAE)[0],
        fiche = d3.select("#fiche"),
        url = lien(info);
    
    fiche.append("p").html("<em>lien direct</em> : <a href='" + url + "'>" + url + "</a>");
    fiche.append("h3").html(info["@code"] + " : " + info.titre);
    fiche.append("h4").html("Compétences");
    if (info.competences.competence.length) {
        fiche.append("ul").selectAll("li")
            .data(info.competences.competence)
            .enter()
            .append("li")
            .html((d) => d["@nom"]);
    } else {
        fiche.append("ul").append("li")
            .html(info.competences.competence["@nom"]);
    }
    
    fiche.append("h4").html("Objectifs");
    fiche.append("p").html(marked.parse(info.objectifs));
    fiche.append("h4").html("Description");
    fiche.append("p").html(marked.parse(info.description.replace("Contenus :", "Contenus :\n\n")));
    fiche.append("h4").html("Apprentissages critiques");
    fiche.append("ul").selectAll("li")
        .data(acs.filter((d) => info.acs.ac.includes(d["@code"])))
        .enter()
        .append("li")
        .html((d) => d["@code"] + " : " + d["#text"]);
    fiche.append("h4").html("Ressources associées");
    fiche.append("ul").selectAll("li")
        .data(res.filter((d) => info.ressources.ressource.includes(d["@code"])))
        .enter()
        .append("li")
        .html((d) => d["@code"] + " : " + d.titre);
}

function affiche_RES (args, acs, sae) {
    'use strict';
    var liste_res = d3.select("#liste_res").selectAll("li"),
        info = liste_res.filter((e) => e["@code"] == args.ressource).data()[0],
        fiche = d3.select("#fiche"), 
        url = lien(info);
        
    fiche.append("p").html("<em>lien direct</em> : <a href='" + url + "'>" + url + "</a>");
    fiche.append("h3").html(info["@code"] + " : " + info.titre);
    fiche.append("h4").html("Compétences");
    if (info.competences.competence.length) {
        fiche.append("ul").selectAll("li")
            .data(info.competences.competence)
            .enter()
            .append("li")
            .html((d) => d["@nom"]);
    } else {
        fiche.append("ul").append("li")
            .html(info.competences.competence["@nom"]);
    }
    fiche.append("h4").html("Description");
    fiche.append("p").html(marked.parse(info.description.replace("Contenus :", "Contenus :\n\n").replace("Contenus\n", "Contenus :\n\n")));
    fiche.append("h4").html("Apprentissages critiques");
    fiche.append("ul").selectAll("li")
        .data(acs.filter((d) => info.acs.ac.includes(d["@code"])))
        .enter()
        .append("li")
        .html((d) => d["@code"] + " : " + d["#text"]);
    if (info.saes) {
        fiche.append("h4").html("SAEs associées");
        fiche.append("ul").selectAll("li")
            .data(sae.filter((d) => info.saes.sae.includes(d["@code"])))
            .enter()
            .append("li")
            .html((d) => d["@code"] + " : " + d.titre);
    }
    fiche.append("h4").html("Mots-clés");
    fiche.append("p").html(info["mots-cles"]);

}

d3.json("pn.json").then(function(data){
    'use strict';
    var pn = data,
        acs = pn.referentiel_competence.competences.competence.map((d) => d.niveaux.niveau.map((e) => e.acs.ac.flat()).flat()).flat(),
        sae = pn.referentiel_formation.semestre.map((d) => d.saes.sae.flat()).map((e, i) => e.map((d) => {d.semestre = (i+1); return d; })).flat()
            .map((e) => {e.codeSAE = e["@code"].replace("É", "E").replace(" ", ""); return e}),
        res = pn.referentiel_formation.semestre.map((d) => d.ressources.ressource.flat()).map((e, i) => e.map((d) => {d.semestre = (i+1); return d; })).flat(),
        parametres = {semestre: 1, ressource: undefined, sae: undefined},
        args = location.search.replace('\?','').split('&').map((e) => e.split('='));
    
    if (location.search.search("semestre") >= 0)
        parametres.semestre = args.filter((d) => d[0] == "semestre")[0][1];
            
    if (location.search.search("ressource") >= 0)
        parametres.ressource = args.filter((d) => d[0] == "ressource")[0][1];

    if (location.search.search("SAE") >= 0)
        parametres.SAE = args.filter((d) => d[0] == "SAE")[0][1];
        
    d3.select("#choix_semestre").selectAll("a")
        .data(data.referentiel_formation.semestre)
        .enter()
        .append("a")
        .style("margin", 2)
        .attr("href", (d, i) => { return (location.origin + location.pathname + "?semestre=" + (i+1)); })
        .append("button")
        .attr("class", (d,i) => "btn btn-lg" + (i == (parametres.semestre-1) ? " btn-primary" : " btn-outline-primary"))
        .html((d) => d["@libelle"]);
    
    remplir_sae(data.referentiel_formation.semestre[parametres.semestre-1].saes.sae);
    remplir_res(data.referentiel_formation.semestre[parametres.semestre-1].ressources.ressource);
    
    if (arguments.SAE) affiche_SAE(parametres, acs, res);
    if (arguments.ressource) affiche_RES(parametres, acs, sae);
});