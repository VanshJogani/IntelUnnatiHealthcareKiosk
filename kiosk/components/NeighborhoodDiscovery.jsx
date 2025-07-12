"use client";
import { useEffect, useRef } from "react";

export default function NeighborhoodDiscovery() {
  const containerRef = useRef(null);

  useEffect(() => {
    // Inject CSS styles
    const style = document.createElement("style");
    style.innerHTML = `/* Paste your CSS from <style> here */
      html, body { height: 100%; margin: 0; padding: 0; }
      .neighborhood-discovery { box-sizing: border-box; font-family: 'Roboto', sans-serif; height: 100%; position: relative; width: 100%; }
      .neighborhood-discovery a { color: #4285f4; text-decoration: none; }
      .neighborhood-discovery button { background: none; border: none; color: inherit; cursor: pointer; font: inherit; font-size: inherit; padding: 0; }
      .neighborhood-discovery .info { color: #555; font-size: 0.9em; margin-top: 0.3em; }
      .neighborhood-discovery .panel { background: white; bottom: 0; box-sizing: border-box; left: 0; overflow-y: auto; position: absolute; top: 0; width: 20em; }
      .neighborhood-discovery .panel.no-scroll { overflow-y: hidden; }
      .neighborhood-discovery .photo { background-color: #dadce0; background-position: center; background-size: cover; border-radius: 0.3em; cursor: pointer; }
      .neighborhood-discovery .navbar { background: white; position: sticky; top: 0; z-index: 2; }
      .neighborhood-discovery .right { float: right; }
      .neighborhood-discovery .star-icon { filter: invert(88%) sepia(60%) saturate(2073%) hue-rotate(318deg) brightness(93%) contrast(104%); height: 1.2em; margin-right: -0.3em; margin-top: -0.08em; vertical-align: top; width: 1.2em; }
      .neighborhood-discovery .star-icon:last-child { margin-right: 0.2em; }
      .neighborhood-discovery .map { bottom: 0; left: 20em; position: absolute; right: 0; top: 0; }
      @media only screen and (max-width: 640px) { .neighborhood-discovery .panel { right: 0; top: 50%; width: unset; } .neighborhood-discovery .map { bottom: 50%; left: 0; } }
      .neighborhood-discovery .places-panel { box-shadow: 0 0 10px rgb(60 64 67 / 28%); z-index: 1; }
      .neighborhood-discovery .places-panel header { padding: 0.5em; }
      .neighborhood-discovery .search-input input { border: 1px solid rgba(0, 0, 0, 0.2); border-radius: 0.3em; box-sizing: border-box; font-size: 1em; height: 2.2em; padding: 0 2.5em 0 1em; width: 100%; }
      .neighborhood-discovery .search-input button { position: absolute; right: 0.8em; top: 0.8em; }
      .neighborhood-discovery .show-more-button { bottom: 0.5em; display: none; left: 28%; line-height: 1.5em; padding: 0.6em; position: relative; width: 44%; }
      .neighborhood-discovery .show-more-button.sticky { background: white; border-radius: 1.5em; box-shadow: 0 4px 10px rgb(60 64 67 / 28%); position: sticky; z-index: 2; }
      .neighborhood-discovery .show-more-button:disabled { opacity: 0.5; }
      .neighborhood-discovery .place-results-list { list-style-type: none; margin: 0; padding: 0; }
      .neighborhood-discovery .place-result { border-top: 1px solid rgba(0, 0, 0, 0.12); cursor: pointer; display: flex; padding: 0.8em; }
      .neighborhood-discovery .place-result .text { flex-grow: 1; }
      .neighborhood-discovery .place-result .name { font-size: 1em; font-weight: 500; text-align: left; }
      .neighborhood-discovery .place-result .photo { flex: 0 0 4em; height: 4em; margin-left: 0.8em; }
      .neighborhood-discovery .details-panel { display: none; z-index: 20; }
      .neighborhood-discovery .details-panel .back-button { color: #4285f4; padding: 0.9em; }
      .neighborhood-discovery .details-panel .back-button .icon { filter: invert(47%) sepia(71%) saturate(2372%) hue-rotate(200deg) brightness(97%) contrast(98%); height: 1.2em; width: 1.2em; vertical-align: bottom; }
      .neighborhood-discovery .details-panel header { padding: 0.9em; }
      .neighborhood-discovery .details-panel h2 { font-size: 1.4em; font-weight: 400; margin: 0; }
      .neighborhood-discovery .details-panel .section { border-top: 1px solid rgba(0, 0, 0, 0.12); padding: 0.9em; }
      .neighborhood-discovery .details-panel .contact { align-items: center; display: flex; font-size: 0.9em; margin: 0.8em 0; }
      .neighborhood-discovery .details-panel .contact .icon { width: 1.5em; height: 1.5em; }
      .neighborhood-discovery .details-panel .contact .text { margin-left: 1em; }
      .neighborhood-discovery .details-panel .contact .weekday { display: inline-block; width: 5em; }
      .neighborhood-discovery .details-panel .photos { text-align: center; }
      .neighborhood-discovery .details-panel .photo { display: inline-block; height: 5.5em; width: 5.5em; }
      .neighborhood-discovery .details-panel .review { margin-top: 1.2em; }
      .neighborhood-discovery .details-panel .review .reviewer-avatar { background-repeat: no-repeat; background-size: cover; float: left; height: 1.8em; margin-right: 0.8em; width: 1.8em; }
      .neighborhood-discovery .details-panel .review .reviewer-name { color: #202124; font-weight: 500; line-height: 1.8em; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .neighborhood-discovery .details-panel .review .rating { margin: 0.5em 0; }
      .neighborhood-discovery .details-panel .attribution { color: #777; margin: 0; font-size: 0.8em; font-style: italic; }
      .neighborhood-discovery .photo-modal { background: rgba(0, 0, 0, 0.8); display: none; height: 100%; position: fixed; width: 100%; z-index: 100; }
      .neighborhood-discovery .photo-modal > img { bottom: 0; left: 0; margin: auto; max-height: 100%; max-width: 100%; position: absolute; right: 0; top: 0; }
      .neighborhood-discovery .photo-modal > div { border-radius: 0.4em; color: white; background: rgba(0, 0, 0, 0.6); margin: 1em; padding: 0.9em; position: absolute; }
      .neighborhood-discovery .photo-modal .back-button .icon { filter: brightness(0) invert(1); margin: 0.4em 0.6em 0 0; }
      .neighborhood-discovery .photo-modal .photo-text { float: right; }
      .neighborhood-discovery .photo-modal .photo-attrs { font-size: 0.8em; margin-top: 0.3em; }
    `;
    document.head.appendChild(style);

    // Inject Handlebars templates
    const resultsTmpl = document.createElement("script");
    resultsTmpl.id = "nd-place-results-tmpl";
    resultsTmpl.type = "text/x-handlebars-template";
    resultsTmpl.innerHTML = `
      {{#each places}}
        <li class="place-result">
          <div class="text">
            <button class="name">{{name}}</button>
            <div class="info">
              {{#if rating}}
                <span>{{rating}}</span>
                <img src="https://fonts.gstatic.com/s/i/googlematerialicons/star/v15/24px.svg" alt="rating" class="star-icon"/>
              {{/if}}
              {{#if numReviews}}
                <span>&nbsp;({{numReviews}})</span>
              {{/if}}
              {{#if priceLevel}}
                &#183;&nbsp;<span>{{#each dollarSigns}}\${{/each}}&nbsp;</span>
              {{/if}}
            </div>
            <div class="info">{{type}}</div>
          </div>
          <button class="photo" style="background-image:url({{photos.0.urlSmall}})" aria-label="show photo in viewer"></button>
        </li>
      {{/each}}
    `;
    document.body.appendChild(resultsTmpl);

    const detailsTmpl = document.createElement("script");
    detailsTmpl.id = "nd-place-details-tmpl";
    detailsTmpl.type = "text/x-handlebars-template";
    detailsTmpl.innerHTML = `...`; // Paste the details template here
    document.body.appendChild(detailsTmpl);

    // Load Handlebars
    const handlebarsScript = document.createElement("script");
    handlebarsScript.src = "https://ajax.googleapis.com/ajax/libs/handlebars/4.7.7/handlebars.min.js";
    handlebarsScript.async = true;
    document.body.appendChild(handlebarsScript);

    // Load Google Maps
    window.initMap = function() {};
    const mapsScript = document.createElement("script");
    mapsScript.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyCi18MEZi8CtB41XEXfOU0ll5zvukXB1oY&callback=initMap&libraries=places,geometry&solution_channel=GMP_QB_neighborhooddiscovery_v3_cADEF";
    mapsScript.async = true;
    mapsScript.defer = true;
    document.body.appendChild(mapsScript);

    // Load the widget logic after scripts are loaded
    // You can move your widget JS into a separate file and load it here, or paste it here
    // For brevity, this is left as a comment

    // Cleanup
    return () => {
      document.head.removeChild(style);
      document.body.removeChild(resultsTmpl);
      document.body.removeChild(detailsTmpl);
      document.body.removeChild(handlebarsScript);
      document.body.removeChild(mapsScript);
    };
  }, []);

  return (
    <div className="neighborhood-discovery" ref={containerRef}>
      {/* Paste the main HTML structure here (the .neighborhood-discovery div and its children) */}
      {/* For brevity, you can copy the content from your HTML file, except for <html>, <head>, <body> */}
    </div>
  );
} 