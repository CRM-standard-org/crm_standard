import { Box, Table, Text } from '@radix-ui/themes'
type Column = {
    header: string;
    key: string;
    align?: string;
};

type SummaryTableProps = {
    title: string;
    columns: Column[];
    data: Record<string, any>[];
};

export const SummaryTable: React.FC<SummaryTableProps> = ({ title, columns, data }) => {
    return (
        <Box>
            <Text weight="bold" className="mb-2">{title}</Text>
            <Table.Root variant="surface" size="1">
                <Table.Header>
                    <Table.Row>
                        {columns.map((col, idx) => (
                            <Table.ColumnHeaderCell
                                key={idx}
                                className={col.align === 'right' ? 'text-end' : 'text-center'}
                            >
                                {col.header}
                            </Table.ColumnHeaderCell>
                        ))}
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {data.map((row, rowIndex) => (
                        <Table.Row key={rowIndex}>
                            {columns.map((col, colIndex) => (
                                <Table.Cell
                                    key={colIndex}
                                    className={col.align === 'right' ? 'text-end' : 'text-center'}
                                >
                                    {row[col.key].toLocaleString()}
                                </Table.Cell>
                            ))}
                        </Table.Row>

                    ))}
                </Table.Body>
            </Table.Root>
        </Box>
    );
};
