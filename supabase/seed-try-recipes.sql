-- kitchenMagic — zwei Rezepte in die Kategorie „Try“ (aus „The Symbiosis Table“)
-- Mehrfach ausführbar: feste IDs + on conflict do nothing.

insert into public.recipes (id, title, category, serves, makes, foodprep, comment, ingredients, steps)
values
(
  'a3f1c2d4-5b6e-4f70-8a91-0c1d2e3f4a51',
  'No-Bake Hazelnut & Date Caramel Cake',
  'try', 18, null, false,
  'Form 28 × 28 cm · Vorbereitung 30 min · 4–6 Std. gefrieren',
  '[
    {"id":"nb-i01","amount":"200 g","name":"Haselnüsse (Boden)","optional":false},
    {"id":"nb-i02","amount":"50 g","name":"Mandeln","optional":false},
    {"id":"nb-i03","amount":"50 g","name":"Pistazien","optional":false},
    {"id":"nb-i04","amount":"125 g","name":"ungesalzene Butter oder Kokosöl, geschmolzen","optional":false},
    {"id":"nb-i05","amount":"240 ml","name":"Milch nach Wahl (Karamell)","optional":false},
    {"id":"nb-i06","amount":"1 EL","name":"Vanilleextrakt","optional":false},
    {"id":"nb-i07","amount":"2 EL","name":"Tahini oder Nussbutter","optional":false},
    {"id":"nb-i08","amount":"800 g","name":"Datteln, entsteint","optional":false},
    {"id":"nb-i09","amount":"","name":"ganze Haselnüsse, dicht bedeckend (Nüsse)","optional":false},
    {"id":"nb-i10","amount":"100 g","name":"dunkle Schokolade (Topping)","optional":false},
    {"id":"nb-i11","amount":"1 Schuss","name":"Milch (Topping)","optional":false}
  ]'::jsonb,
  '[
    {"id":"nb-s1","text":"Boden: Haselnüsse, Mandeln und Pistazien im Food Processor zu feinen Bröseln mixen. Geschmolzene Butter zugeben und mixen, bis es wie nasser Sand wirkt. Fest in die Form drücken."},
    {"id":"nb-s2","text":"Karamell: Milch, Vanille, Tahini und Datteln in eine große Schüssel geben und mit dem Stabmixer cremig pürieren. Auf dem Boden verstreichen. Tipp: Zu fest zum Streichen? Etwas mehr Milch zugeben."},
    {"id":"nb-s3","text":"Nüsse: Ganze Haselnüsse grob hacken und dicht auf dem Karamell verteilen – jeder Bissen soll eine Nuss treffen."},
    {"id":"nb-s4","text":"Schokotopping: Dunkle Schokolade mit einem Schuss Milch bei niedriger Hitze unter Rühren schmelzen. Über die Nussschicht gießen und bis zum Rand verstreichen."},
    {"id":"nb-s5","text":"Einfrieren & servieren: 4–6 Std. im Gefrierfach fest werden lassen. Vor dem Servieren einige Minuten bei Raumtemperatur stehen lassen, damit es sich sauber schneiden lässt."}
  ]'::jsonb
),
(
  'b4e2d3e5-6c7f-4a81-9ba2-1d2e3f4a5b62',
  'Pistachio Baklawa Cheesecake Tartlets',
  'try', null, 12, false,
  'Tipp: Die Pistazien fein mahlen, damit der Boden gut zusammenhält. Vorbereitung 25 min · Backen 25–30 min',
  '[
    {"id":"pb-i01","amount":"12 Blätter","name":"Filoteig (Teig)","optional":false},
    {"id":"pb-i02","amount":"100 g","name":"geschmolzene Butter (Teig)","optional":false},
    {"id":"pb-i03","amount":"¾ cup","name":"gemahlene Pistazien (Pistazienboden)","optional":false},
    {"id":"pb-i04","amount":"2 EL","name":"geschmolzene Butter (Pistazienboden)","optional":false},
    {"id":"pb-i05","amount":"225 g","name":"Frischkäse (Füllung)","optional":false},
    {"id":"pb-i06","amount":"75 g","name":"Zucker","optional":false},
    {"id":"pb-i07","amount":"1","name":"Ei","optional":false},
    {"id":"pb-i08","amount":"2 TL","name":"Vanilleextrakt","optional":false},
    {"id":"pb-i09","amount":"2 EL","name":"Sahne","optional":false},
    {"id":"pb-i10","amount":"","name":"Zuckersirup (Attir) oder Ahornsirup/Honig (zum Beträufeln)","optional":false},
    {"id":"pb-i11","amount":"","name":"extra Pistazien","optional":false}
  ]'::jsonb,
  '[
    {"id":"pb-s1","text":"Ofen auf 180 °C vorheizen und eine 12er-Muffinform leicht einfetten."},
    {"id":"pb-s2","text":"Filo schichten: 6 Blätter großzügig mit geschmolzener Butter bestreichen und ordentlich stapeln. Mit den restlichen 6 Blättern wiederholen."},
    {"id":"pb-s3","text":"Formen: Jeden Stapel in 6 Kreise schneiden, passend für die Muffinform. Die Teigkreise sanft hineindrücken."},
    {"id":"pb-s4","text":"Pistazienboden: Gemahlene Pistazien und geschmolzene Butter mischen. Gleichmäßig, aber fest in die Filo-Förmchen drücken. Backen, bis der Rand leicht goldbraun ist."},
    {"id":"pb-s5","text":"Füllung: Frischkäse, Zucker, Ei, Vanille und Sahne glatt und cremig verrühren."},
    {"id":"pb-s6","text":"Füllen & backen: Füllung gleichmäßig auf den Pistazienboden gießen. 20–25 Min. backen, bis sie gerade gestockt und der Filo goldbraun und knusprig ist."},
    {"id":"pb-s7","text":"Abschluss: Die Törtchen mit warmem Attir (Ahornsirup oder Honig) beträufeln und vor dem Servieren großzügig mit extra Pistazien garnieren."}
  ]'::jsonb
)
on conflict (id) do nothing;
