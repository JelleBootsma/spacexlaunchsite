export async function executeGraphQLQuery(query, variables) {

    let result  = await fetch('https://api.spacex.land/graphql/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            query: query,
            variables: variables,
        })
    })
    return await result.json();
}
