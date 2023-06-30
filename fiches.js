var pn = "debut";

/*
choix_semestre = function(m, sem) {
    d3.select("#choix_semestre").selectAll("a").classed("active", false);
    d3.select(this).classed("active", true);
    
    d3.select("#liste_sae").html("");
    d3.select("#liste_res").html("");
    remplir_sae(sem.saes.sae);
    remplir_res(sem.ressources.ressource);
}

/*

selection_fiche = function(ca) {
    d3.select("#liste_sae").selectAll("a").classed("active", false);
    d3.select("#liste_res").selectAll("a").classed("active", false);
    d3.select(ca).classed("active", true);
    
    d3.select("#fiche").html("");
}

choix_fiche_sae = function(m, info) {
    selection_fiche(this);

    var fiche = d3.select("#fiche");
    fiche.append("h3").html(info["@code"] + " : " + info.titre);
    fiche.append("h4").html("Compétences");
    if (info.competences.competence.length) {
        fiche.append("ul").selectAll("li")
            .data(info.competences.competence)
            .enter()
            .append("li")
            .html(d => d["@nom"]);
    } else {
        fiche.append("ul").append("li")
            .html(info.competences.competence["@nom"]);
    }
    
    fiche.append("h4").html("Objectifs");
    fiche.append("p").html(marked.parse(info.objectifs));
    fiche.append("h4").html("Description");
    fiche.append("p").html(marked.parse(info.description));
    fiche.append("h4").html("Apprentissages critiques");
    fiche.append("ul").selectAll("li")
        .data(acs.filter(d => info.acs.ac.includes(d["@code"])))
        .enter()
        .append("li")
        .html(d => d["@code"] + " : " + d["#text"]);
    fiche.append("h4").html("Ressources associées");
    fiche.append("ul").selectAll("li")
        .data(res.filter(d => info.ressources.ressource.includes(d["@code"])))
        .enter()
        .append("li")
        .html(d => d["@code"] + " : " + d.titre);
}

choix_fiche_res = function(m, info) {
    selection_fiche(this);
    
    var fiche = d3.select("#fiche");
    fiche.append("p").html("<em>lien direct</em> : <code>http://fxjollois.github.io/but-sd/?semestre=");
    console.log(info);
    fiche.append("h3").html(info["@code"] + " : " + info.titre);
    fiche.append("h4").html("Compétences");
    if (info.competences.competence.length) {
        fiche.append("ul").selectAll("li")
            .data(info.competences.competence)
            .enter()
            .append("li")
            .html(d => d["@nom"]);
    } else {
        fiche.append("ul").append("li")
            .html(info.competences.competence["@nom"]);
    }
    fiche.append("h4").html("Description");
    fiche.append("p").html(marked.parse(info.description));
    fiche.append("h4").html("Apprentissages critiques");
    fiche.append("ul").selectAll("li")
        .data(acs.filter(d => info.acs.ac.includes(d["@code"])))
        .enter()
        .append("li")
        .html(d => d["@code"] + " : " + d["#text"]);
    fiche.append("h4").html("SAEs associées");
    fiche.append("ul").selectAll("li")
        .data(sae.filter(d => info.saes.sae.includes(d["@code"])))
        .enter()
        .append("li")
        .html(d => d["@code"] + " : " + d.titre);
    fiche.append("h4").html("Mots-clés");
    fiche.append("p").html(info["mots-cles"]);
    
}

*/

remplir_sae = function(sae) {
    d3.select("#liste_sae").append("ul").attr("class", "nav nav-pills").selectAll("li")
        .data(sae)
        .enter()
        .append("li")
        .attr("class", "nav-item")
        .append("a")
        .attr("class", "nav-link")
        .attr("href", lien)
        .html(d => d["@code"])
        // .on("click", choix_fiche_sae);
}
remplir_res = function(res) {
    d3.select("#liste_res").append("ul").attr("class", "nav nav-pills").selectAll("li")
        .data(res)
        .enter()
        .append("li")
        .attr("class", "nav-item")
        .append("a")
        .attr("class", "nav-link")
        .attr("href", lien)
        .html(d => d["@code"])
        // .on("click", choix_fiche_res);
}

lien = function(info) {
    var url = location.origin + location.pathname + "?semestre=" + info["semestre"];
    if (info["code_"]) {
        url += "&SAE=" + info["code_"]
    } else {
        url += "&ressource=" + info["@code"]
    }
    return (url);
}


affiche_SAE = function(arguments) {
    var liste_sae = d3.select("#liste_sae").selectAll("li"),
        info = liste_sae.data().filter(e => e["code_"] == arguments.SAE)[0],
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
            .html(d => d["@nom"]);
    } else {
        fiche.append("ul").append("li")
            .html(info.competences.competence["@nom"]);
    }
    
    fiche.append("h4").html("Objectifs");
    fiche.append("p").html(marked.parse(info.objectifs));
    fiche.append("h4").html("Description");
    fiche.append("p").html(marked.parse(info.description));
    fiche.append("h4").html("Apprentissages critiques");
    fiche.append("ul").selectAll("li")
        .data(acs.filter(d => info.acs.ac.includes(d["@code"])))
        .enter()
        .append("li")
        .html(d => d["@code"] + " : " + d["#text"]);
    fiche.append("h4").html("Ressources associées");
    fiche.append("ul").selectAll("li")
        .data(res.filter(d => info.ressources.ressource.includes(d["@code"])))
        .enter()
        .append("li")
        .html(d => d["@code"] + " : " + d.titre);
}

affiche_RES = function(arguments) {
    var liste_res = d3.select("#liste_res").selectAll("li"),
        info = liste_res.filter(e => e["@code"] == arguments.ressource).data()[0],
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
            .html(d => d["@nom"]);
    } else {
        fiche.append("ul").append("li")
            .html(info.competences.competence["@nom"]);
    }
    fiche.append("h4").html("Description");
    fiche.append("p").html(marked.parse(info.description.replace("Contenu :", "Contenu :\n")));
    fiche.append("h4").html("Apprentissages critiques");
    fiche.append("ul").selectAll("li")
        .data(acs.filter(d => info.acs.ac.includes(d["@code"])))
        .enter()
        .append("li")
        .html(d => d["@code"] + " : " + d["#text"]);
    fiche.append("h4").html("SAEs associées");
    fiche.append("ul").selectAll("li")
        .data(sae.filter(d => info.saes.sae.includes(d["@code"])))
        .enter()
        .append("li")
        .html(d => d["@code"] + " : " + d.titre);
    fiche.append("h4").html("Mots-clés");
    fiche.append("p").html(info["mots-cles"]);

}

d3.json("pn.json").then(function(data){
    pn = data;
    acs = pn.referentiel_competence.competences.competence.map(d => d.niveaux.niveau.map(e => e.acs.ac.flat()).flat()).flat();
    sae = pn.referentiel_formation.semestre.map(d => d.saes.sae.flat()).map((e, i) => e.map(d => {d.semestre = (i+1); return d; })).flat()
        .map(e => {e.code_ = e["@code"].replace("É", "E").replace(" ", ""); return e});
    res = pn.referentiel_formation.semestre.map(d => d.ressources.ressource.flat()).map((e, i) => e.map(d => {d.semestre = (i+1); return d; })).flat();
    arguments = {semestre: 1, ressource: undefined, sae: undefined};
    
    args = location.search.replace('\?','').split('&').map(e => e.split('='))
    
    if (location.search.search("semestre") >= 0)
        arguments.semestre = args.filter(d => d[0] == "semestre")[0][1]
            
    if (location.search.search("ressource") >= 0)
        arguments.ressource = args.filter(d => d[0] == "ressource")[0][1]

    if (location.search.search("SAE") >= 0)
        arguments.SAE = args.filter(d => d[0] == "SAE")[0][1]
        
    d3.select("#choix_semestre").selectAll("a")
        .data(data.referentiel_formation.semestre)
        .enter()
        .append("a")
        .style("margin", 2)
        .attr("href", (d, i) => { return (location.origin + location.pathname + "?semestre=" + (i+1)); })
        .append("button")
        .attr("class", (d,i) => "btn btn-lg" + (i == (arguments.semestre-1) ? " btn-primary" : " btn-outline-primary"))
        .html(d => d["@libelle"])
        //.on("click", choix_semestre);
    
    remplir_sae(data.referentiel_formation.semestre[arguments.semestre-1].saes.sae);
    remplir_res(data.referentiel_formation.semestre[arguments.semestre-1].ressources.ressource);
    
    if (arguments.SAE) affiche_SAE(arguments)
    if (arguments.ressource) affiche_RES(arguments)
});