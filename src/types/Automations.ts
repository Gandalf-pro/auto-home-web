export interface AutomationCondition {
	id: string;
	type?: 'feature' | 'time';
	featureUrl: string;
	dataKey: string;
	operation: '>' | '<' | '<=' | '>=' | '==' | '!=' | '===' | '!==';
	value: any;
}
export type singleConditionExpressionType = '||' | '&&' | '(' | ')' | string;
export type conditionExpressionType = singleConditionExpressionType[];

export interface AutomationAction {
	featureUrl: string;
	data: { [key: string]: any };
}

export interface AutomationJson {
	id?: string;
	name: string;
	timeout?: number;
	condition: { [id: string]: AutomationCondition };
	conditionExpression: conditionExpressionType;
	action: AutomationAction;
	lastExecuted?: Date;
}

export interface AutomationsData {
	[id: string]: AutomationJson;
}
