import type { TSelectTreeNodeExtended } from "@/entities/offices/hooks/useOfficeFilters.ts";

export const flattenTreeData = (
    nodes: any[],
    level = 0,
    result: Array<TSelectTreeNodeExtended> = []
): Array<TSelectTreeNodeExtended> => {
    nodes.forEach((node) => {
        result.push({
            title: node.title,
            level,
            isGroup: !!node.children && node.children.length > 0,
            type: node.type,
            office_id: node.office_id,
            floor_id: node.floor_id,
            workspace_id: node.workspace_id,
            plan: node.plan
        });
        if (node.children) {
            flattenTreeData(node.children, level + 1, result);
        }
    });
    return result;
};
