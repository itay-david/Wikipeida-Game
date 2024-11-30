import axios from 'axios';

export const fetchWikipediaPage = async (pageName) => {
  try {
    const response = await axios.get('https://en.wikipedia.org/w/api.php', {
      params: {
        action: 'query',
        format: 'json',
        prop: 'extracts|links',
        titles: pageName,
        pllimit: 'max',
        origin: '*'
      }
    });

    const pageId = Object.keys(response.data.query.pages)[0];
    const pageData = response.data.query.pages[pageId];

    return {
      title: pageData.title,
      content: pageData.extract,
      links: pageData.links ? pageData.links.map(link => link.title) : []
    };
  } catch (error) {
    console.error('Error fetching Wikipedia page:', error);
    return null;
  }
};

export const searchWikipediaPages = async (query) => {
  try {
    const response = await axios.get('https://en.wikipedia.org/w/api.php', {
      params: {
        action: 'query',
        format: 'json',
        list: 'search',
        srsearch: query,
        origin: '*'
      }
    });

    return response.data.query.search.map(result => result.title);
  } catch (error) {
    console.error('Error searching Wikipedia:', error);
    return [];
  }
};