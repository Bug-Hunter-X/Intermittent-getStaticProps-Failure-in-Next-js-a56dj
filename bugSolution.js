// pages/my-page.js

export async function getStaticProps() {
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 1000; // 1 second

  async function fetchData() {
    try {
      const response = await fetch('https://api.example.com/data');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error; // Re-throw to be handled by retry logic
    }
  }

  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      const data = await fetchData();
      return {
        props: {
          data,
        },
      };
    } catch (error) {
      if (i === MAX_RETRIES - 1) {
        console.error('Failed to fetch data after multiple retries.');
        return {
          props: {
            data: null, // or a fallback default
          },
        };
      }
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (i + 1)));
    }
  }
}

function MyPage({ data }) {
  return (
    <div>
      <h1>My Page</h1>
      {data ? (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      ) : (
        <p>Failed to load data.</p>
      )}
    </div>
  );
}

export default MyPage;