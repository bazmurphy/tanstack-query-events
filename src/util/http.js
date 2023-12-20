// we make the parameter an object, and as a second property we use searchTerm
export async function fetchEvents({ signal, searchTerm }) {
  // log to see the object passed by TanStack Query to the queryFn
  console.log("searchTerm:", searchTerm);

  let url = "http://localhost:4000/events";

  // we add a way to dynamically append the url with the searchTerm
  if (searchTerm) {
    url += "?search=" + searchTerm;
  }

  // we can pass the signal coming from the TanStack QueryFn Object to the fetch so the browser can cancel it
  const response = await fetch(url, { signal: signal });

  if (!response.ok) {
    const error = new Error("An error occurred while fetching the events");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const { events } = await response.json();

  return events;
}
