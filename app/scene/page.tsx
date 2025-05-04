import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { SCENES } from '@/lib/scenes';

export default function SceneDoc() {
    const functionCode = `const baseInstructions = \`
You are a smart translation assistant.
- Detect the input language:
  • If it's in Chinese, output only the English translation.
  • If it's in any other language (e.g., English, German, French), output only the Chinese translation.
- Do not add explanations, commentary, or extra text—only the translated output.
\`;

  if (!sceneObj) {
    return \`
        {baseInstructions}
        Translate the following text:
        \`;
  }

  // Enriched scene-specific instructions
  return \`
    {baseInstructions}
    Scenario: name
    Description: description

    Additional guidelines:
        - Follow the tone, formality, and structure implied by this scenario.
        - Use vocabulary and sentence patterns appropriate to the context.
        - Respect any special formatting (e.g., greetings and closings for emails, headings for minutes).
        - Keep the translation clear, concise, and natural.

    Prompt blueprint:
    {prompt}

    Translate the following text:
    \`;`;

  return (
    <div className="mt-20 max-w-3xl mx-auto p-6 bg-background shadow rounded-lg">
      <h1 className="text-2xl font-bold mb-6">System Prompt Generator and Scene Descriptions</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">System Prompt </h2>
        <p className="mb-4 text-muted-foreground">
          The createSystemPrompt function dynamically generates translation prompts based on the selected scene.
        </p>
        <p className=" text-muted-foreground">
        Prompt content is configured in <code className="text-blue-500">api/chat/route.ts</code>; update that file to adjust the prompts.
        </p>
        <pre className="px-4 py-5">
          <code className="relative font-mono text-sm leading-none" data-language="javascript"> 
                {functionCode}
          </code>
        </pre>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Available Scenes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SCENES.map((s) => (
            <Card key={s.name}>
              <CardContent className="space-y-3">
                <h3 className="text-lg font-medium">
                  {s.name} ({s.name_en})
                </h3>
                <p className="text-sm text-muted-foreground">{s.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}