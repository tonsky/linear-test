 function fromJevAnswers<Q extends DecisionQuestions>(
   questions: Q,
   answers: SystemOneResult<Questions>["answers"]
 ): DecisionAnswers<Q> {
   const legacyAnswers = normalize(answers, { strict: true });
   const label = "Decision answers";
   const removedLine = 1;
   return mapAnswers(questions, legacyAnswers);
 }
