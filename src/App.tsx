import { useEffect, useState } from 'react';
import { MapView } from './lib/components/Map';

function App() {
  const [sparqlData, setSparqlData] = useState(null);

  const endpointUrl = '/api'; // This is the proxy URL for the QLever SPARQL endpoint
  const sparqlQuery = `#All level-4 regions in France
PREFIX osmkey: <https://www.openstreetmap.org/wiki/Key:>
PREFIX osmrel: <https://www.openstreetmap.org/relation/>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX osm: <https://www.openstreetmap.org/>
PREFIX ogc: <http://www.opengis.net/rdf#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX geo: <http://www.opengis.net/ont/geosparql#>
SELECT ?region ?name ?geometry WHERE {
  osmrel:2202162 ogc:sfContains ?region .
  ?region osmkey:boundary "administrative" .
  ?region osmkey:admin_level "4"^^xsd:int .
  ?region rdf:type osm:relation .
  ?region osmkey:name ?name .
  ?region geo:hasGeometry/geo:asWKT ?geometry .
}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(endpointUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/sparql-query',
            'Accept': 'application/sparql-results+json'
          },
          body: sparqlQuery
        });
        const data = await response.json();
        setSparqlData(data?.results.bindings);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [sparqlQuery]);

  return (
    <>
      {!sparqlData ?
        (<div className='text-2xl text-white'>Loading...</div>)
        : (
          <MapView
            data={sparqlData}
            className='h-screen'
          />
        )}
    </>
  )
}

export default App
