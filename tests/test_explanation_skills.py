import json
from pathlib import Path
import re
import unittest

from run_explanation_smoke import build_prompts


ROOT = Path(__file__).resolve().parents[1]
FAMILY = {"eli5", "change-tldr", "change-explainer"}
PUBLISHED = FAMILY | {"software-critique", "medical-assistant", "bro", "grounded-deliverable", "study-book"}


class ExplanationSkillsTests(unittest.TestCase):
    def test_manifest_and_groups_cover_published_skills(self):
        manifest = json.loads((ROOT / ".claude-plugin/plugin.json").read_text())
        paths = [ROOT / path for path in manifest["skills"]]
        self.assertCountEqual([path.name for path in paths], PUBLISHED)
        for path in paths:
            self.assertTrue((path / "SKILL.md").is_file(), path)
        groups = json.loads((ROOT / "skills.sh.json").read_text())["groupings"]
        self.assertCountEqual(
            [name for group in groups for name in group["skills"]], PUBLISHED
        )

    def test_family_metadata_and_example_links(self):
        for name in FAMILY:
            with self.subTest(skill=name):
                path = ROOT / "skills" / name / "SKILL.md"
                text = path.read_text()
                self.assertTrue(text.startswith("---\n"))
                frontmatter = text.split("---", 2)[1]
                self.assertRegex(frontmatter, rf"(?m)^name: {re.escape(name)}$")
                self.assertRegex(frontmatter, r"(?m)^description: .+")
                self.assertIn("[references/examples.md](references/examples.md)", text)
                self.assertTrue((path.parent / "references/examples.md").is_file())
                for target in re.findall(r"\[[^\]]+\]\(([^)]+)\)", text):
                    if "://" not in target and not target.startswith("#"):
                        self.assertTrue((path.parent / target.split("#")[0]).exists(), target)

    def test_behavioral_case_schema(self):
        cases = json.loads((ROOT / "tests/explanation_cases.json").read_text())
        self.assertEqual(len(cases), len({case["id"] for case in cases}))
        for case in cases:
            with self.subTest(case=case["id"]):
                self.assertRegex(case["id"], r"^[a-z][a-z0-9-]+$")
                self.assertTrue(case["skills"])
                self.assertLessEqual(set(case["skills"]), FAMILY)
                for key in ("request", "evidence"):
                    self.assertIsInstance(case[key], str)
                    self.assertTrue(case[key].strip())
                self.assertGreaterEqual(len(case["criteria"]), 2)
                self.assertTrue(all(isinstance(item, str) and item.strip() for item in case["criteria"]))

    def test_smoke_prompt_excludes_review_criteria(self):
        case = {
            "skills": ["eli5"],
            "request": "Explain indexes.",
            "evidence": "General concept question.",
            "criteria": ["PRIVATE_REVIEW_CRITERION"],
        }
        system, user = build_prompts(case)
        self.assertNotIn("PRIVATE_REVIEW_CRITERION", system + user)
        self.assertIn("name: eli5", system)
        self.assertNotIn("name: change-explainer", system)
        self.assertIn(case["request"], user)
        self.assertIn(case["evidence"], user)

    def test_target_rules_match_across_change_skills(self):
        rules = []
        for name in ("change-tldr", "change-explainer"):
            text = (ROOT / "skills" / name / "SKILL.md").read_text()
            rules.append([
                line.strip() for line in text.splitlines()
                if line.strip().startswith((
                    "- Single commit:", "- Explicit range",
                    "- Branch:", "- Session work:",
                ))
            ])
        self.assertEqual(len(rules[0]), 4)
        self.assertEqual(rules[0], rules[1])


if __name__ == "__main__":
    unittest.main()
