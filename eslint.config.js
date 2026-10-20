import zin from "@zinkawaii/eslint-config";
import css from "@zinkawaii/eslint-config-css";

export default zin().append(css).setDefaultIgnores((prev) => [...prev, "**/*.css"]);
