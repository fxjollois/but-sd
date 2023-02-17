var pn = "debut";

choix_semestre = function(m, sem) {
    d3.select("#choix_semestre").selectAll("a").classed("active", false);
    d3.select(this).classed("active", true);
    
    d3.select("#liste_sae").html("");
    d3.select("#liste_res").html("");
    remplir_sae(sem.saes.sae);
    remplir_res(sem.ressources.ressource);
}


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

remplir_sae = function(sae) {
    d3.select("#liste_sae").append("ul").attr("class", "nav nav-pills").selectAll("li")
        .data(sae)
        .enter()
        .append("li")
        .attr("class", "nav-item")
        .append("a")
        .attr("class", "nav-link")
        .html(d => d["@code"])
        .on("click", choix_fiche_sae);
}
remplir_res = function(res) {
    d3.select("#liste_res").append("ul").attr("class", "nav nav-pills").selectAll("li")
        .data(res)
        .enter()
        .append("li")
        .attr("class", "nav-item")
        .append("a")
        .attr("class", "nav-link")
        .html(d => d["@code"])
        .on("click", choix_fiche_res);
}

d3.json("pn.json").then(function(data){
    pn = data;
    acs = pn.referentiel_competence.competences.competence.map(d => d.niveaux.niveau.map(e => e.acs.ac.flat()).flat()).flat();
    sae = pn.referentiel_formation.semestre.map(d => d.saes.sae.flat()).flat();
    res = pn.referentiel_formation.semestre.map(d => d.ressources.ressource.flat()).flat();
    
    
    d3.select("#choix_semestre").append("ul").attr("class", "nav nav-pills").selectAll("li")
        .data(data.referentiel_formation.semestre)
        .enter()
        .append("li")
        .attr("class", "nav-item")
        .append("a")
        .attr("class", (d,i) => i == 0 ? "nav-link active" : "nav-link")
        .html(d => d["@libelle"])
        .on("click", choix_semestre);
    
    remplir_sae(data.referentiel_formation.semestre[0].saes.sae);
    remplir_res(data.referentiel_formation.semestre[0].ressources.ressource);
});