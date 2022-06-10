/*global d3,marked,URLSearchParams,location*/

/* CHOIX DU PARCOURS : EMS par défaut */
d3.select("#choix_parcours").selectAll("button")
    .data(["EMS", "VCOD"])
    .enter()
    .append("a")
    .attr("href", function(d) {
        var q = new URLSearchParams(location.search);
        q.delete("type");
        q.delete("numero");
        q.delete("parcours");
        q.append("parcours", d);
        return "index.html?" + q.toString();
    })
    .append("button")
    .attr("class", function(d) { 
        var q = new URLSearchParams(location.search);
        return q.get("parcours") == d ? "selected" : ""
    })
    .html(function(d) { return d; })
    .on("click", function() { d3.select("#fiche").html(""); });

/* CHOIX DES SEMESTRES */
d3.select("#choix_semestre").selectAll("button")
    .data(["tous", 1, 2, 3, 4, 5, 6])
    .enter()
    .append("a")
    .attr("href", function(d) {
        var q = new URLSearchParams(location.search);
        q.delete("type");
        q.delete("numero");
        q.delete("semestre");
        q.append("semestre", d);
        return "index.html?" + q.toString();
    })
    .append("button")
    .attr("class", function(d) {  
        var q = new URLSearchParams(location.search);
        return q.get("semestre") == d ? "selected" : "none"
    })
    .html(function(d) { return d; });

var creation = function(but) {
    d3.select("#choix_fiche").selectAll(".bouton")
        .data(but)
        .enter()
        .append("a")
        .attr("class", function(d) { return "bouton " + d.type; })
        .attr("href", function(d) {
            var q = new URLSearchParams(location.search);
            q.delete("type")
            q.delete("numero")
            q.append("type", d.type)
            q.append("numero", d.numero)
            return "index.html?" + q.toString(); 
        })
        .style("display", function(d) {
            var q = new URLSearchParams(location.search), test_parcours = true, test_semestre = true;
            test_parcours = d.parcours.includes(q.get("parcours"));
            test_semestre = q.get("semestre") == "tous" ? true : q.get("semestre") == d.semestre;
            return test_parcours && test_semestre ? "inline-block" : "none";
            })
        .append("button")
        .classed("selected", function(d) {
            var q = new URLSearchParams(location.search);
            return d.parcours.includes(q.get("parcours")) && q.get("semestre") == d.semestre && q.get("type") == d.type && q.get("numero") == d.numero;
        })
        .html(function(d) { return d.numero_long; })
    
    var q = new URLSearchParams(location.search);
    if (q.get("type") != null && q.get("numero") != null) {
        var fiche = but.filter(function(d) { 
            return d.parcours.includes(q.get("parcours")) && q.get("semestre") == d.semestre && d.type == q.get("type") && d.numero == q.get("numero")
        })[0];
        if (fiche != undefined) {
            d3.select("#fiche").html("<h2>" + fiche.libelle + "</h2>" + 
                                     "<ul id='details'><li>Parcours : " + (Array.isArray(fiche.parcours) ? fiche.parcours.join(", ") : fiche.parcours) + 
                                        "</li><li>Semestre : " + fiche.semestre + 
                                        "</li><li>Numéro : " + fiche.numero_long +
                                     "</li></ul>" +
                                     marked.parse(fiche.texte));
        }
    }
}

var q = new URLSearchParams(location.search);
if (!q.has("parcours") || !q.has("semestre")) {
    q.append("parcours", "EMS")
    q.append("semestre", "tous")
    location.replace("index.html?" + q.toString())
} else {
    d3.json("but-sd.json").then(creation);
}
