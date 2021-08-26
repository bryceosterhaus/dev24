import Head from "next/head";

import ClayButton from "@clayui/button";
import { Sheet, SheetSection } from "@clayui/layout";
import { ClaySelectWithOption } from "@clayui/form";

let client;

export default function Api() {
  const [totalDocs, setTotalDocs] = React.useState(0);
  const [results, setResults] = React.useState("");
  const [property, setProperty] = React.useState("companyId");

  React.useEffect(() => {
    let SDK = window.__LIFERAY_REMOTE_APP_SDK__;

    if (!SDK) {
      console.error("No __LIFERAY_REMOTE_APP_SDK__ on window");

      return "No __LIFERAY_REMOTE_APP_SDK__ on window";
    }

    client = new SDK.Client({ debug: true });
  }, []);

  return (
    <div>
      <Head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@clayui/css/lib/css/atlas.css"
        />

        <script src="http://localhost:8080/o/remote-app-client-js/remote-app-client-js.js"></script>
      </Head>

      <Sheet size="lg">
        <SheetSection>
          <ClayButton.Group spaced>
            <ClayButton
              onClick={() => {
                client.openToast({ message: "Hello from the other side" });
              }}
            >
              Open Toast Message
            </ClayButton>

            <ClayButton
              onClick={() => {
                client.fetch("http://localhost:8080/c/portal/extend_session");
              }}
            >
              Extend Session
            </ClayButton>

            <ClayButton
              onClick={() => {
                client
                  .graphql('{documents(siteKey: "40141") {totalCount}}')
                  .then(function (data) {
                    if (data.data) {
                      setTotalDocs(data.data.documents.totalCount);
                    }
                  })
                  .catch(function (error) {
                    console.log("caught", error);
                  });
              }}
            >
              GraphQL (totalDocs: {totalDocs})
            </ClayButton>
          </ClayButton.Group>
        </SheetSection>

        <SheetSection>
          <ClaySelectWithOption
            multiple={false}
            options={[
              { value: "companyId", label: "companyId" },
              { value: "css", label: "css" },
              { value: "defaultLanguageId", label: "defaultLanguageId" },
              { value: "isControlPanel", label: "isControlPanel" },
              { value: "languageId", label: "languageId" },
              { value: "isSignedIn", label: "isSignedIn" },
              { value: "userId", label: "userId" },
              { value: "userName", label: "userName" },
            ]}
            onChange={(e) => setProperty(e.target.value)}
            value={property}
          />

          <br />

          <ClayButton
            onClick={() => {
              client.get(property).then(function (value) {
                setResults(JSON.stringify(value));
              });
            }}
          >
            GET
          </ClayButton>
        </SheetSection>

        <pre>{results}</pre>
      </Sheet>
    </div>
  );
}
