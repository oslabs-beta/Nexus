export function testFunction() {
  console.log(this);
}


export async function getServerSideProps(context) {
  return {
    props: {
      serverData: 'Data'
    }, // will be passed to the page component as props
  };
}

const SSRComponent = ({ serverData }) => {
  return (
    <div>
      <h1>SSR Component</h1>
      <h2>{serverData}</h2>
    </div>
  );
};

export default SSRComponent;