annee = function(annee) {
    var contenu = d3.create("div");
    contenu.append("h4").html("BUT " + annee["@ordre"]);
    return (contenu.node());
}


archi_parcours = function (m, parcours) {
    var comps_id = [... new Set(parcours.annee.map(d => d.competence).flat().map(d => d["@id"]))];
    d3.select("#archi").html("");
    d3.select("#archi").append("div")
        .attr("class", "row")
        .selectAll("div")
        .data(comp.filter(d => comps_id.includes(d["@id"])))
        .enter()
        .append("div")
        .attr("class", "col-sm-3")
        .append("h4")
        .attr("class", "competence bg-secondary text-white")
        .html(d => d["@libelle_long"]);
    parcours.annee.forEach(d => {
        d3.select("#archi").append("div")
            .attr("class", "row")
            .selectAll("div")
            .data(d.competence)
            .enter()
            .append("div")
            .attr("class", "col-sm-3")
            .append("div")
            .attr("class", "niveau")
            .html(d => {
                c = comp.filter(e => e["@id"] == d["@id"])[0]
                n = c.niveaux.niveau.filter(e => e["@ordre"] == d["@niveau"])[0]
                return(n["@libelle"])
        })
    })
}

parcours = function(parcours) {
    var contenu = d3.create("div");
    contenu.append("h2").html(parcours["@code"]);
    contenu.append("h3").html(parcours["@libelle"]);
    contenu.on("click", archi_parcours)
    return (contenu.node());
}

d3.json("pn.json").then(function(pn) {
    comp = pn.referentiel_competence.competences.competence;
        
    d3.select("#parcours").selectAll("div")
        .data(pn.referentiel_competence.parcours.parcour)
        .enter()
        .append("div")
        .attr("class", "col-md-6")
        .append(d => parcours(d));
})